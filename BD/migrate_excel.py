import pandas as pd
import psycopg2
from psycopg2 import extras
import os
from dotenv import load_dotenv

# Load database environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'BACKEND', '.env')
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL and '?schema=' in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split('?')[0]

def to_bool(val):
    if val is None: return None
    if isinstance(val, bool): return val
    s = str(val).strip().upper()
    if s in ('X', 'SI', 'TRUE', '1', 'YES'): return True
    if s in ('', 'NO', 'FALSE', '0', 'EMPTY'): return False
    return None

def to_float(val):
    if val is None: return None
    try: return float(val)
    except: return None

def to_int(val):
    if val is None: return None
    try: return int(float(val))
    except: return None

def migrate_data():
    try:
        excel_file = 'CLIENTE.xlsx'
        df = pd.read_excel(excel_file, header=None)
        print(f"Read {len(df)} rows, {len(df.columns)} columns")

        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        print("Recreating table...")
        with open('create_table.sql', 'r', encoding='utf-8') as f:
            sql = f.read()
        cur.execute("DROP TABLE IF EXISTS expediente CASCADE;")
        cur.execute(sql)
        conn.commit()

        print(f"Excel row 1 with indices:")
        first_row = df.iloc[1]
        for idx, val in enumerate(first_row):
            print(f"  [{idx}] {val} ({type(val)})")

        # Connection sanity check
        cur.execute("SELECT 1")
        print("SQL SELECT 1 success.")

        insert_query = """
            INSERT INTO expediente (
                cliente, direccion, depto, municipio, seccion, chacra, manzana, parcela, lote,
                partida_inmobiliaria, objeto, fecha_relevamiento, fecha_presentacion_municipalidad,
                expte_muni, certificado_catastral, informe_dominial, fecha_ingreso_dominio,
                fecha_egreso_dominio, titular, responsable, telefono_contacto, fecha_presupuesto,
                falta_relevar, importe_presupuesto, entrega, fecha_libre_deuda, aprobacion_muni,
                disposicion_n, presentacion_dgc, expediente_n, previa_dgc, definitiva_dgc,
                visado_dgc, plano_registrado, correccion, campo1, terminado
            ) VALUES %s
        """
        
        single_row_placeholder = "(" + ",".join(["%s"] * 37) + ")"
        single_row_query = insert_query.replace("VALUES %s", "VALUES " + single_row_placeholder)

        data_to_insert = []
        start_row = 1
        
        for index, row in df.iloc[start_row:].iterrows():
            # Unified cliente from index 1 and 2
            ap = str(row[1]) if len(row) > 1 and not pd.isna(row[1]) else ""
            nom = str(row[2]) if len(row) > 2 and not pd.isna(row[2]) else ""
            cliente_full = f"{ap} {nom}".strip()
            
            vals = [None] * 37
            vals[0] = cliente_full
            
            # Map other 36 columns from Excel starting at index 3
            # Excel columns 3 to 38 map to SQL columns 1 to 36
            for sql_idx in range(1, 37):
                excel_idx = sql_idx + 2 # offset of 2 because SQL 0 is unified Excel 1+2
                if excel_idx < len(row):
                    val = row[excel_idx]
                    if pd.isna(val):
                        val = None
                    elif isinstance(val, pd.Timestamp):
                        val = val.to_pydatetime()
                    vals[sql_idx] = val
            
            # Casting
            vals[3] = to_int(vals[3])  # municipio
            vals[4] = to_int(vals[4])  # seccion
            vals[5] = to_int(vals[5])  # chacra
            vals[6] = to_int(vals[6])  # manzana
            vals[22] = to_bool(vals[22])
            vals[23] = to_float(vals[23])
            vals[24] = to_bool(vals[24])
            vals[26] = to_bool(vals[26])
            vals[33] = to_bool(vals[33])
            vals[34] = to_bool(vals[34])
            vals[36] = to_bool(vals[36])

            data_to_insert.append(tuple(vals))

        print(f"Prepared {len(data_to_insert)} rows.")
        
        # Row by row insert to find the error
        for i, row_data in enumerate(data_to_insert):
            # Clean data one last time for safety
            final_row = []
            for v in row_data:
                if hasattr(v, 'item'): # numpy type
                    v = v.item()
                final_row.append(v)
            final_row = tuple(final_row)

            try:
                cur.execute(single_row_query, final_row)
            except Exception as row_err:
                print(f"FAILED_AT_ROW_{i+1}")
                print(f"DATABASE_ERROR: {row_err}")
                print(f"VALUES_LEN: {len(final_row)}")
                # Cross check count
                import re
                placeholders = re.findall(r"%s", single_row_query)
                print(f"PLACEHOLDERS_IN_QUERY: {len(placeholders)}")
                for idx, v in enumerate(final_row):
                    print(f"[{idx}] {v} ({type(v)})")
                raise row_err
        
        conn.commit()
        print("MIGRATION_SUCCESS")

    except Exception as e:
        print(f"MIGRATION_ERROR: {e}")
        if 'conn' in locals(): conn.rollback()
    finally:
        if 'cur' in locals(): cur.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    migrate_data()

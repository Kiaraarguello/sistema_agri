
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model expediente
 * 
 */
export type expediente = $Result.DefaultSelection<Prisma.$expedientePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Expedientes
 * const expedientes = await prisma.expediente.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Expedientes
   * const expedientes = await prisma.expediente.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.expediente`: Exposes CRUD operations for the **expediente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Expedientes
    * const expedientes = await prisma.expediente.findMany()
    * ```
    */
  get expediente(): Prisma.expedienteDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    expediente: 'expediente'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "expediente"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      expediente: {
        payload: Prisma.$expedientePayload<ExtArgs>
        fields: Prisma.expedienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.expedienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.expedienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload>
          }
          findFirst: {
            args: Prisma.expedienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.expedienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload>
          }
          findMany: {
            args: Prisma.expedienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload>[]
          }
          create: {
            args: Prisma.expedienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload>
          }
          createMany: {
            args: Prisma.expedienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.expedienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload>[]
          }
          delete: {
            args: Prisma.expedienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload>
          }
          update: {
            args: Prisma.expedienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload>
          }
          deleteMany: {
            args: Prisma.expedienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.expedienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.expedienteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload>[]
          }
          upsert: {
            args: Prisma.expedienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$expedientePayload>
          }
          aggregate: {
            args: Prisma.ExpedienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExpediente>
          }
          groupBy: {
            args: Prisma.expedienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExpedienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.expedienteCountArgs<ExtArgs>
            result: $Utils.Optional<ExpedienteCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    expediente?: expedienteOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model expediente
   */

  export type AggregateExpediente = {
    _count: ExpedienteCountAggregateOutputType | null
    _avg: ExpedienteAvgAggregateOutputType | null
    _sum: ExpedienteSumAggregateOutputType | null
    _min: ExpedienteMinAggregateOutputType | null
    _max: ExpedienteMaxAggregateOutputType | null
  }

  export type ExpedienteAvgAggregateOutputType = {
    id: number | null
    municipio: number | null
    seccion: number | null
    chacra: number | null
    manzana: number | null
    importe_presupuesto: Decimal | null
  }

  export type ExpedienteSumAggregateOutputType = {
    id: bigint | null
    municipio: number | null
    seccion: number | null
    chacra: number | null
    manzana: number | null
    importe_presupuesto: Decimal | null
  }

  export type ExpedienteMinAggregateOutputType = {
    id: bigint | null
    cliente: string | null
    direccion: string | null
    depto: string | null
    municipio: number | null
    seccion: number | null
    chacra: number | null
    manzana: number | null
    parcela: string | null
    lote: string | null
    partida_inmobiliaria: string | null
    objeto: string | null
    fecha_relevamiento: Date | null
    fecha_presentacion_municipalidad: Date | null
    expte_muni: string | null
    certificado_catastral: string | null
    informe_dominial: string | null
    fecha_ingreso_dominio: Date | null
    fecha_egreso_dominio: Date | null
    titular: string | null
    responsable: string | null
    telefono_contacto: string | null
    fecha_presupuesto: Date | null
    falta_relevar: boolean | null
    importe_presupuesto: Decimal | null
    entrega: boolean | null
    fecha_libre_deuda: Date | null
    aprobacion_muni: boolean | null
    disposicion_n: string | null
    presentacion_dgc: Date | null
    expediente_n: string | null
    previa_dgc: Date | null
    definitiva_dgc: Date | null
    visado_dgc: Date | null
    plano_registrado: boolean | null
    correccion: boolean | null
    campo1: string | null
    terminado: boolean | null
  }

  export type ExpedienteMaxAggregateOutputType = {
    id: bigint | null
    cliente: string | null
    direccion: string | null
    depto: string | null
    municipio: number | null
    seccion: number | null
    chacra: number | null
    manzana: number | null
    parcela: string | null
    lote: string | null
    partida_inmobiliaria: string | null
    objeto: string | null
    fecha_relevamiento: Date | null
    fecha_presentacion_municipalidad: Date | null
    expte_muni: string | null
    certificado_catastral: string | null
    informe_dominial: string | null
    fecha_ingreso_dominio: Date | null
    fecha_egreso_dominio: Date | null
    titular: string | null
    responsable: string | null
    telefono_contacto: string | null
    fecha_presupuesto: Date | null
    falta_relevar: boolean | null
    importe_presupuesto: Decimal | null
    entrega: boolean | null
    fecha_libre_deuda: Date | null
    aprobacion_muni: boolean | null
    disposicion_n: string | null
    presentacion_dgc: Date | null
    expediente_n: string | null
    previa_dgc: Date | null
    definitiva_dgc: Date | null
    visado_dgc: Date | null
    plano_registrado: boolean | null
    correccion: boolean | null
    campo1: string | null
    terminado: boolean | null
  }

  export type ExpedienteCountAggregateOutputType = {
    id: number
    cliente: number
    direccion: number
    depto: number
    municipio: number
    seccion: number
    chacra: number
    manzana: number
    parcela: number
    lote: number
    partida_inmobiliaria: number
    objeto: number
    fecha_relevamiento: number
    fecha_presentacion_municipalidad: number
    expte_muni: number
    certificado_catastral: number
    informe_dominial: number
    fecha_ingreso_dominio: number
    fecha_egreso_dominio: number
    titular: number
    responsable: number
    telefono_contacto: number
    fecha_presupuesto: number
    falta_relevar: number
    importe_presupuesto: number
    entrega: number
    fecha_libre_deuda: number
    aprobacion_muni: number
    disposicion_n: number
    presentacion_dgc: number
    expediente_n: number
    previa_dgc: number
    definitiva_dgc: number
    visado_dgc: number
    plano_registrado: number
    correccion: number
    campo1: number
    terminado: number
    _all: number
  }


  export type ExpedienteAvgAggregateInputType = {
    id?: true
    municipio?: true
    seccion?: true
    chacra?: true
    manzana?: true
    importe_presupuesto?: true
  }

  export type ExpedienteSumAggregateInputType = {
    id?: true
    municipio?: true
    seccion?: true
    chacra?: true
    manzana?: true
    importe_presupuesto?: true
  }

  export type ExpedienteMinAggregateInputType = {
    id?: true
    cliente?: true
    direccion?: true
    depto?: true
    municipio?: true
    seccion?: true
    chacra?: true
    manzana?: true
    parcela?: true
    lote?: true
    partida_inmobiliaria?: true
    objeto?: true
    fecha_relevamiento?: true
    fecha_presentacion_municipalidad?: true
    expte_muni?: true
    certificado_catastral?: true
    informe_dominial?: true
    fecha_ingreso_dominio?: true
    fecha_egreso_dominio?: true
    titular?: true
    responsable?: true
    telefono_contacto?: true
    fecha_presupuesto?: true
    falta_relevar?: true
    importe_presupuesto?: true
    entrega?: true
    fecha_libre_deuda?: true
    aprobacion_muni?: true
    disposicion_n?: true
    presentacion_dgc?: true
    expediente_n?: true
    previa_dgc?: true
    definitiva_dgc?: true
    visado_dgc?: true
    plano_registrado?: true
    correccion?: true
    campo1?: true
    terminado?: true
  }

  export type ExpedienteMaxAggregateInputType = {
    id?: true
    cliente?: true
    direccion?: true
    depto?: true
    municipio?: true
    seccion?: true
    chacra?: true
    manzana?: true
    parcela?: true
    lote?: true
    partida_inmobiliaria?: true
    objeto?: true
    fecha_relevamiento?: true
    fecha_presentacion_municipalidad?: true
    expte_muni?: true
    certificado_catastral?: true
    informe_dominial?: true
    fecha_ingreso_dominio?: true
    fecha_egreso_dominio?: true
    titular?: true
    responsable?: true
    telefono_contacto?: true
    fecha_presupuesto?: true
    falta_relevar?: true
    importe_presupuesto?: true
    entrega?: true
    fecha_libre_deuda?: true
    aprobacion_muni?: true
    disposicion_n?: true
    presentacion_dgc?: true
    expediente_n?: true
    previa_dgc?: true
    definitiva_dgc?: true
    visado_dgc?: true
    plano_registrado?: true
    correccion?: true
    campo1?: true
    terminado?: true
  }

  export type ExpedienteCountAggregateInputType = {
    id?: true
    cliente?: true
    direccion?: true
    depto?: true
    municipio?: true
    seccion?: true
    chacra?: true
    manzana?: true
    parcela?: true
    lote?: true
    partida_inmobiliaria?: true
    objeto?: true
    fecha_relevamiento?: true
    fecha_presentacion_municipalidad?: true
    expte_muni?: true
    certificado_catastral?: true
    informe_dominial?: true
    fecha_ingreso_dominio?: true
    fecha_egreso_dominio?: true
    titular?: true
    responsable?: true
    telefono_contacto?: true
    fecha_presupuesto?: true
    falta_relevar?: true
    importe_presupuesto?: true
    entrega?: true
    fecha_libre_deuda?: true
    aprobacion_muni?: true
    disposicion_n?: true
    presentacion_dgc?: true
    expediente_n?: true
    previa_dgc?: true
    definitiva_dgc?: true
    visado_dgc?: true
    plano_registrado?: true
    correccion?: true
    campo1?: true
    terminado?: true
    _all?: true
  }

  export type ExpedienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which expediente to aggregate.
     */
    where?: expedienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of expedientes to fetch.
     */
    orderBy?: expedienteOrderByWithRelationInput | expedienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: expedienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` expedientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` expedientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned expedientes
    **/
    _count?: true | ExpedienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExpedienteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExpedienteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExpedienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExpedienteMaxAggregateInputType
  }

  export type GetExpedienteAggregateType<T extends ExpedienteAggregateArgs> = {
        [P in keyof T & keyof AggregateExpediente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExpediente[P]>
      : GetScalarType<T[P], AggregateExpediente[P]>
  }




  export type expedienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: expedienteWhereInput
    orderBy?: expedienteOrderByWithAggregationInput | expedienteOrderByWithAggregationInput[]
    by: ExpedienteScalarFieldEnum[] | ExpedienteScalarFieldEnum
    having?: expedienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExpedienteCountAggregateInputType | true
    _avg?: ExpedienteAvgAggregateInputType
    _sum?: ExpedienteSumAggregateInputType
    _min?: ExpedienteMinAggregateInputType
    _max?: ExpedienteMaxAggregateInputType
  }

  export type ExpedienteGroupByOutputType = {
    id: bigint
    cliente: string | null
    direccion: string | null
    depto: string | null
    municipio: number | null
    seccion: number | null
    chacra: number | null
    manzana: number | null
    parcela: string | null
    lote: string | null
    partida_inmobiliaria: string | null
    objeto: string | null
    fecha_relevamiento: Date | null
    fecha_presentacion_municipalidad: Date | null
    expte_muni: string | null
    certificado_catastral: string | null
    informe_dominial: string | null
    fecha_ingreso_dominio: Date | null
    fecha_egreso_dominio: Date | null
    titular: string | null
    responsable: string | null
    telefono_contacto: string | null
    fecha_presupuesto: Date | null
    falta_relevar: boolean | null
    importe_presupuesto: Decimal | null
    entrega: boolean | null
    fecha_libre_deuda: Date | null
    aprobacion_muni: boolean | null
    disposicion_n: string | null
    presentacion_dgc: Date | null
    expediente_n: string | null
    previa_dgc: Date | null
    definitiva_dgc: Date | null
    visado_dgc: Date | null
    plano_registrado: boolean | null
    correccion: boolean | null
    campo1: string | null
    terminado: boolean | null
    _count: ExpedienteCountAggregateOutputType | null
    _avg: ExpedienteAvgAggregateOutputType | null
    _sum: ExpedienteSumAggregateOutputType | null
    _min: ExpedienteMinAggregateOutputType | null
    _max: ExpedienteMaxAggregateOutputType | null
  }

  type GetExpedienteGroupByPayload<T extends expedienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExpedienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExpedienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExpedienteGroupByOutputType[P]>
            : GetScalarType<T[P], ExpedienteGroupByOutputType[P]>
        }
      >
    >


  export type expedienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cliente?: boolean
    direccion?: boolean
    depto?: boolean
    municipio?: boolean
    seccion?: boolean
    chacra?: boolean
    manzana?: boolean
    parcela?: boolean
    lote?: boolean
    partida_inmobiliaria?: boolean
    objeto?: boolean
    fecha_relevamiento?: boolean
    fecha_presentacion_municipalidad?: boolean
    expte_muni?: boolean
    certificado_catastral?: boolean
    informe_dominial?: boolean
    fecha_ingreso_dominio?: boolean
    fecha_egreso_dominio?: boolean
    titular?: boolean
    responsable?: boolean
    telefono_contacto?: boolean
    fecha_presupuesto?: boolean
    falta_relevar?: boolean
    importe_presupuesto?: boolean
    entrega?: boolean
    fecha_libre_deuda?: boolean
    aprobacion_muni?: boolean
    disposicion_n?: boolean
    presentacion_dgc?: boolean
    expediente_n?: boolean
    previa_dgc?: boolean
    definitiva_dgc?: boolean
    visado_dgc?: boolean
    plano_registrado?: boolean
    correccion?: boolean
    campo1?: boolean
    terminado?: boolean
  }, ExtArgs["result"]["expediente"]>

  export type expedienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cliente?: boolean
    direccion?: boolean
    depto?: boolean
    municipio?: boolean
    seccion?: boolean
    chacra?: boolean
    manzana?: boolean
    parcela?: boolean
    lote?: boolean
    partida_inmobiliaria?: boolean
    objeto?: boolean
    fecha_relevamiento?: boolean
    fecha_presentacion_municipalidad?: boolean
    expte_muni?: boolean
    certificado_catastral?: boolean
    informe_dominial?: boolean
    fecha_ingreso_dominio?: boolean
    fecha_egreso_dominio?: boolean
    titular?: boolean
    responsable?: boolean
    telefono_contacto?: boolean
    fecha_presupuesto?: boolean
    falta_relevar?: boolean
    importe_presupuesto?: boolean
    entrega?: boolean
    fecha_libre_deuda?: boolean
    aprobacion_muni?: boolean
    disposicion_n?: boolean
    presentacion_dgc?: boolean
    expediente_n?: boolean
    previa_dgc?: boolean
    definitiva_dgc?: boolean
    visado_dgc?: boolean
    plano_registrado?: boolean
    correccion?: boolean
    campo1?: boolean
    terminado?: boolean
  }, ExtArgs["result"]["expediente"]>

  export type expedienteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cliente?: boolean
    direccion?: boolean
    depto?: boolean
    municipio?: boolean
    seccion?: boolean
    chacra?: boolean
    manzana?: boolean
    parcela?: boolean
    lote?: boolean
    partida_inmobiliaria?: boolean
    objeto?: boolean
    fecha_relevamiento?: boolean
    fecha_presentacion_municipalidad?: boolean
    expte_muni?: boolean
    certificado_catastral?: boolean
    informe_dominial?: boolean
    fecha_ingreso_dominio?: boolean
    fecha_egreso_dominio?: boolean
    titular?: boolean
    responsable?: boolean
    telefono_contacto?: boolean
    fecha_presupuesto?: boolean
    falta_relevar?: boolean
    importe_presupuesto?: boolean
    entrega?: boolean
    fecha_libre_deuda?: boolean
    aprobacion_muni?: boolean
    disposicion_n?: boolean
    presentacion_dgc?: boolean
    expediente_n?: boolean
    previa_dgc?: boolean
    definitiva_dgc?: boolean
    visado_dgc?: boolean
    plano_registrado?: boolean
    correccion?: boolean
    campo1?: boolean
    terminado?: boolean
  }, ExtArgs["result"]["expediente"]>

  export type expedienteSelectScalar = {
    id?: boolean
    cliente?: boolean
    direccion?: boolean
    depto?: boolean
    municipio?: boolean
    seccion?: boolean
    chacra?: boolean
    manzana?: boolean
    parcela?: boolean
    lote?: boolean
    partida_inmobiliaria?: boolean
    objeto?: boolean
    fecha_relevamiento?: boolean
    fecha_presentacion_municipalidad?: boolean
    expte_muni?: boolean
    certificado_catastral?: boolean
    informe_dominial?: boolean
    fecha_ingreso_dominio?: boolean
    fecha_egreso_dominio?: boolean
    titular?: boolean
    responsable?: boolean
    telefono_contacto?: boolean
    fecha_presupuesto?: boolean
    falta_relevar?: boolean
    importe_presupuesto?: boolean
    entrega?: boolean
    fecha_libre_deuda?: boolean
    aprobacion_muni?: boolean
    disposicion_n?: boolean
    presentacion_dgc?: boolean
    expediente_n?: boolean
    previa_dgc?: boolean
    definitiva_dgc?: boolean
    visado_dgc?: boolean
    plano_registrado?: boolean
    correccion?: boolean
    campo1?: boolean
    terminado?: boolean
  }

  export type expedienteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cliente" | "direccion" | "depto" | "municipio" | "seccion" | "chacra" | "manzana" | "parcela" | "lote" | "partida_inmobiliaria" | "objeto" | "fecha_relevamiento" | "fecha_presentacion_municipalidad" | "expte_muni" | "certificado_catastral" | "informe_dominial" | "fecha_ingreso_dominio" | "fecha_egreso_dominio" | "titular" | "responsable" | "telefono_contacto" | "fecha_presupuesto" | "falta_relevar" | "importe_presupuesto" | "entrega" | "fecha_libre_deuda" | "aprobacion_muni" | "disposicion_n" | "presentacion_dgc" | "expediente_n" | "previa_dgc" | "definitiva_dgc" | "visado_dgc" | "plano_registrado" | "correccion" | "campo1" | "terminado", ExtArgs["result"]["expediente"]>

  export type $expedientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "expediente"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      cliente: string | null
      direccion: string | null
      depto: string | null
      municipio: number | null
      seccion: number | null
      chacra: number | null
      manzana: number | null
      parcela: string | null
      lote: string | null
      partida_inmobiliaria: string | null
      objeto: string | null
      fecha_relevamiento: Date | null
      fecha_presentacion_municipalidad: Date | null
      expte_muni: string | null
      certificado_catastral: string | null
      informe_dominial: string | null
      fecha_ingreso_dominio: Date | null
      fecha_egreso_dominio: Date | null
      titular: string | null
      responsable: string | null
      telefono_contacto: string | null
      fecha_presupuesto: Date | null
      falta_relevar: boolean | null
      importe_presupuesto: Prisma.Decimal | null
      entrega: boolean | null
      fecha_libre_deuda: Date | null
      aprobacion_muni: boolean | null
      disposicion_n: string | null
      presentacion_dgc: Date | null
      expediente_n: string | null
      previa_dgc: Date | null
      definitiva_dgc: Date | null
      visado_dgc: Date | null
      plano_registrado: boolean | null
      correccion: boolean | null
      campo1: string | null
      terminado: boolean | null
    }, ExtArgs["result"]["expediente"]>
    composites: {}
  }

  type expedienteGetPayload<S extends boolean | null | undefined | expedienteDefaultArgs> = $Result.GetResult<Prisma.$expedientePayload, S>

  type expedienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<expedienteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExpedienteCountAggregateInputType | true
    }

  export interface expedienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['expediente'], meta: { name: 'expediente' } }
    /**
     * Find zero or one Expediente that matches the filter.
     * @param {expedienteFindUniqueArgs} args - Arguments to find a Expediente
     * @example
     * // Get one Expediente
     * const expediente = await prisma.expediente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends expedienteFindUniqueArgs>(args: SelectSubset<T, expedienteFindUniqueArgs<ExtArgs>>): Prisma__expedienteClient<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Expediente that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {expedienteFindUniqueOrThrowArgs} args - Arguments to find a Expediente
     * @example
     * // Get one Expediente
     * const expediente = await prisma.expediente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends expedienteFindUniqueOrThrowArgs>(args: SelectSubset<T, expedienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__expedienteClient<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Expediente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {expedienteFindFirstArgs} args - Arguments to find a Expediente
     * @example
     * // Get one Expediente
     * const expediente = await prisma.expediente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends expedienteFindFirstArgs>(args?: SelectSubset<T, expedienteFindFirstArgs<ExtArgs>>): Prisma__expedienteClient<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Expediente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {expedienteFindFirstOrThrowArgs} args - Arguments to find a Expediente
     * @example
     * // Get one Expediente
     * const expediente = await prisma.expediente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends expedienteFindFirstOrThrowArgs>(args?: SelectSubset<T, expedienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__expedienteClient<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Expedientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {expedienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Expedientes
     * const expedientes = await prisma.expediente.findMany()
     * 
     * // Get first 10 Expedientes
     * const expedientes = await prisma.expediente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const expedienteWithIdOnly = await prisma.expediente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends expedienteFindManyArgs>(args?: SelectSubset<T, expedienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Expediente.
     * @param {expedienteCreateArgs} args - Arguments to create a Expediente.
     * @example
     * // Create one Expediente
     * const Expediente = await prisma.expediente.create({
     *   data: {
     *     // ... data to create a Expediente
     *   }
     * })
     * 
     */
    create<T extends expedienteCreateArgs>(args: SelectSubset<T, expedienteCreateArgs<ExtArgs>>): Prisma__expedienteClient<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Expedientes.
     * @param {expedienteCreateManyArgs} args - Arguments to create many Expedientes.
     * @example
     * // Create many Expedientes
     * const expediente = await prisma.expediente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends expedienteCreateManyArgs>(args?: SelectSubset<T, expedienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Expedientes and returns the data saved in the database.
     * @param {expedienteCreateManyAndReturnArgs} args - Arguments to create many Expedientes.
     * @example
     * // Create many Expedientes
     * const expediente = await prisma.expediente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Expedientes and only return the `id`
     * const expedienteWithIdOnly = await prisma.expediente.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends expedienteCreateManyAndReturnArgs>(args?: SelectSubset<T, expedienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Expediente.
     * @param {expedienteDeleteArgs} args - Arguments to delete one Expediente.
     * @example
     * // Delete one Expediente
     * const Expediente = await prisma.expediente.delete({
     *   where: {
     *     // ... filter to delete one Expediente
     *   }
     * })
     * 
     */
    delete<T extends expedienteDeleteArgs>(args: SelectSubset<T, expedienteDeleteArgs<ExtArgs>>): Prisma__expedienteClient<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Expediente.
     * @param {expedienteUpdateArgs} args - Arguments to update one Expediente.
     * @example
     * // Update one Expediente
     * const expediente = await prisma.expediente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends expedienteUpdateArgs>(args: SelectSubset<T, expedienteUpdateArgs<ExtArgs>>): Prisma__expedienteClient<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Expedientes.
     * @param {expedienteDeleteManyArgs} args - Arguments to filter Expedientes to delete.
     * @example
     * // Delete a few Expedientes
     * const { count } = await prisma.expediente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends expedienteDeleteManyArgs>(args?: SelectSubset<T, expedienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Expedientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {expedienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Expedientes
     * const expediente = await prisma.expediente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends expedienteUpdateManyArgs>(args: SelectSubset<T, expedienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Expedientes and returns the data updated in the database.
     * @param {expedienteUpdateManyAndReturnArgs} args - Arguments to update many Expedientes.
     * @example
     * // Update many Expedientes
     * const expediente = await prisma.expediente.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Expedientes and only return the `id`
     * const expedienteWithIdOnly = await prisma.expediente.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends expedienteUpdateManyAndReturnArgs>(args: SelectSubset<T, expedienteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Expediente.
     * @param {expedienteUpsertArgs} args - Arguments to update or create a Expediente.
     * @example
     * // Update or create a Expediente
     * const expediente = await prisma.expediente.upsert({
     *   create: {
     *     // ... data to create a Expediente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Expediente we want to update
     *   }
     * })
     */
    upsert<T extends expedienteUpsertArgs>(args: SelectSubset<T, expedienteUpsertArgs<ExtArgs>>): Prisma__expedienteClient<$Result.GetResult<Prisma.$expedientePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Expedientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {expedienteCountArgs} args - Arguments to filter Expedientes to count.
     * @example
     * // Count the number of Expedientes
     * const count = await prisma.expediente.count({
     *   where: {
     *     // ... the filter for the Expedientes we want to count
     *   }
     * })
    **/
    count<T extends expedienteCountArgs>(
      args?: Subset<T, expedienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExpedienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Expediente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpedienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExpedienteAggregateArgs>(args: Subset<T, ExpedienteAggregateArgs>): Prisma.PrismaPromise<GetExpedienteAggregateType<T>>

    /**
     * Group by Expediente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {expedienteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends expedienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: expedienteGroupByArgs['orderBy'] }
        : { orderBy?: expedienteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, expedienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExpedienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the expediente model
   */
  readonly fields: expedienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for expediente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__expedienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the expediente model
   */
  interface expedienteFieldRefs {
    readonly id: FieldRef<"expediente", 'BigInt'>
    readonly cliente: FieldRef<"expediente", 'String'>
    readonly direccion: FieldRef<"expediente", 'String'>
    readonly depto: FieldRef<"expediente", 'String'>
    readonly municipio: FieldRef<"expediente", 'Int'>
    readonly seccion: FieldRef<"expediente", 'Int'>
    readonly chacra: FieldRef<"expediente", 'Int'>
    readonly manzana: FieldRef<"expediente", 'Int'>
    readonly parcela: FieldRef<"expediente", 'String'>
    readonly lote: FieldRef<"expediente", 'String'>
    readonly partida_inmobiliaria: FieldRef<"expediente", 'String'>
    readonly objeto: FieldRef<"expediente", 'String'>
    readonly fecha_relevamiento: FieldRef<"expediente", 'DateTime'>
    readonly fecha_presentacion_municipalidad: FieldRef<"expediente", 'DateTime'>
    readonly expte_muni: FieldRef<"expediente", 'String'>
    readonly certificado_catastral: FieldRef<"expediente", 'String'>
    readonly informe_dominial: FieldRef<"expediente", 'String'>
    readonly fecha_ingreso_dominio: FieldRef<"expediente", 'DateTime'>
    readonly fecha_egreso_dominio: FieldRef<"expediente", 'DateTime'>
    readonly titular: FieldRef<"expediente", 'String'>
    readonly responsable: FieldRef<"expediente", 'String'>
    readonly telefono_contacto: FieldRef<"expediente", 'String'>
    readonly fecha_presupuesto: FieldRef<"expediente", 'DateTime'>
    readonly falta_relevar: FieldRef<"expediente", 'Boolean'>
    readonly importe_presupuesto: FieldRef<"expediente", 'Decimal'>
    readonly entrega: FieldRef<"expediente", 'Boolean'>
    readonly fecha_libre_deuda: FieldRef<"expediente", 'DateTime'>
    readonly aprobacion_muni: FieldRef<"expediente", 'Boolean'>
    readonly disposicion_n: FieldRef<"expediente", 'String'>
    readonly presentacion_dgc: FieldRef<"expediente", 'DateTime'>
    readonly expediente_n: FieldRef<"expediente", 'String'>
    readonly previa_dgc: FieldRef<"expediente", 'DateTime'>
    readonly definitiva_dgc: FieldRef<"expediente", 'DateTime'>
    readonly visado_dgc: FieldRef<"expediente", 'DateTime'>
    readonly plano_registrado: FieldRef<"expediente", 'Boolean'>
    readonly correccion: FieldRef<"expediente", 'Boolean'>
    readonly campo1: FieldRef<"expediente", 'String'>
    readonly terminado: FieldRef<"expediente", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * expediente findUnique
   */
  export type expedienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * Filter, which expediente to fetch.
     */
    where: expedienteWhereUniqueInput
  }

  /**
   * expediente findUniqueOrThrow
   */
  export type expedienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * Filter, which expediente to fetch.
     */
    where: expedienteWhereUniqueInput
  }

  /**
   * expediente findFirst
   */
  export type expedienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * Filter, which expediente to fetch.
     */
    where?: expedienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of expedientes to fetch.
     */
    orderBy?: expedienteOrderByWithRelationInput | expedienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for expedientes.
     */
    cursor?: expedienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` expedientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` expedientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of expedientes.
     */
    distinct?: ExpedienteScalarFieldEnum | ExpedienteScalarFieldEnum[]
  }

  /**
   * expediente findFirstOrThrow
   */
  export type expedienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * Filter, which expediente to fetch.
     */
    where?: expedienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of expedientes to fetch.
     */
    orderBy?: expedienteOrderByWithRelationInput | expedienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for expedientes.
     */
    cursor?: expedienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` expedientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` expedientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of expedientes.
     */
    distinct?: ExpedienteScalarFieldEnum | ExpedienteScalarFieldEnum[]
  }

  /**
   * expediente findMany
   */
  export type expedienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * Filter, which expedientes to fetch.
     */
    where?: expedienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of expedientes to fetch.
     */
    orderBy?: expedienteOrderByWithRelationInput | expedienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing expedientes.
     */
    cursor?: expedienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` expedientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` expedientes.
     */
    skip?: number
    distinct?: ExpedienteScalarFieldEnum | ExpedienteScalarFieldEnum[]
  }

  /**
   * expediente create
   */
  export type expedienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * The data needed to create a expediente.
     */
    data?: XOR<expedienteCreateInput, expedienteUncheckedCreateInput>
  }

  /**
   * expediente createMany
   */
  export type expedienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many expedientes.
     */
    data: expedienteCreateManyInput | expedienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * expediente createManyAndReturn
   */
  export type expedienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * The data used to create many expedientes.
     */
    data: expedienteCreateManyInput | expedienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * expediente update
   */
  export type expedienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * The data needed to update a expediente.
     */
    data: XOR<expedienteUpdateInput, expedienteUncheckedUpdateInput>
    /**
     * Choose, which expediente to update.
     */
    where: expedienteWhereUniqueInput
  }

  /**
   * expediente updateMany
   */
  export type expedienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update expedientes.
     */
    data: XOR<expedienteUpdateManyMutationInput, expedienteUncheckedUpdateManyInput>
    /**
     * Filter which expedientes to update
     */
    where?: expedienteWhereInput
    /**
     * Limit how many expedientes to update.
     */
    limit?: number
  }

  /**
   * expediente updateManyAndReturn
   */
  export type expedienteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * The data used to update expedientes.
     */
    data: XOR<expedienteUpdateManyMutationInput, expedienteUncheckedUpdateManyInput>
    /**
     * Filter which expedientes to update
     */
    where?: expedienteWhereInput
    /**
     * Limit how many expedientes to update.
     */
    limit?: number
  }

  /**
   * expediente upsert
   */
  export type expedienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * The filter to search for the expediente to update in case it exists.
     */
    where: expedienteWhereUniqueInput
    /**
     * In case the expediente found by the `where` argument doesn't exist, create a new expediente with this data.
     */
    create: XOR<expedienteCreateInput, expedienteUncheckedCreateInput>
    /**
     * In case the expediente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<expedienteUpdateInput, expedienteUncheckedUpdateInput>
  }

  /**
   * expediente delete
   */
  export type expedienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
    /**
     * Filter which expediente to delete.
     */
    where: expedienteWhereUniqueInput
  }

  /**
   * expediente deleteMany
   */
  export type expedienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which expedientes to delete
     */
    where?: expedienteWhereInput
    /**
     * Limit how many expedientes to delete.
     */
    limit?: number
  }

  /**
   * expediente without action
   */
  export type expedienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the expediente
     */
    select?: expedienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the expediente
     */
    omit?: expedienteOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ExpedienteScalarFieldEnum: {
    id: 'id',
    cliente: 'cliente',
    direccion: 'direccion',
    depto: 'depto',
    municipio: 'municipio',
    seccion: 'seccion',
    chacra: 'chacra',
    manzana: 'manzana',
    parcela: 'parcela',
    lote: 'lote',
    partida_inmobiliaria: 'partida_inmobiliaria',
    objeto: 'objeto',
    fecha_relevamiento: 'fecha_relevamiento',
    fecha_presentacion_municipalidad: 'fecha_presentacion_municipalidad',
    expte_muni: 'expte_muni',
    certificado_catastral: 'certificado_catastral',
    informe_dominial: 'informe_dominial',
    fecha_ingreso_dominio: 'fecha_ingreso_dominio',
    fecha_egreso_dominio: 'fecha_egreso_dominio',
    titular: 'titular',
    responsable: 'responsable',
    telefono_contacto: 'telefono_contacto',
    fecha_presupuesto: 'fecha_presupuesto',
    falta_relevar: 'falta_relevar',
    importe_presupuesto: 'importe_presupuesto',
    entrega: 'entrega',
    fecha_libre_deuda: 'fecha_libre_deuda',
    aprobacion_muni: 'aprobacion_muni',
    disposicion_n: 'disposicion_n',
    presentacion_dgc: 'presentacion_dgc',
    expediente_n: 'expediente_n',
    previa_dgc: 'previa_dgc',
    definitiva_dgc: 'definitiva_dgc',
    visado_dgc: 'visado_dgc',
    plano_registrado: 'plano_registrado',
    correccion: 'correccion',
    campo1: 'campo1',
    terminado: 'terminado'
  };

  export type ExpedienteScalarFieldEnum = (typeof ExpedienteScalarFieldEnum)[keyof typeof ExpedienteScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type expedienteWhereInput = {
    AND?: expedienteWhereInput | expedienteWhereInput[]
    OR?: expedienteWhereInput[]
    NOT?: expedienteWhereInput | expedienteWhereInput[]
    id?: BigIntFilter<"expediente"> | bigint | number
    cliente?: StringNullableFilter<"expediente"> | string | null
    direccion?: StringNullableFilter<"expediente"> | string | null
    depto?: StringNullableFilter<"expediente"> | string | null
    municipio?: IntNullableFilter<"expediente"> | number | null
    seccion?: IntNullableFilter<"expediente"> | number | null
    chacra?: IntNullableFilter<"expediente"> | number | null
    manzana?: IntNullableFilter<"expediente"> | number | null
    parcela?: StringNullableFilter<"expediente"> | string | null
    lote?: StringNullableFilter<"expediente"> | string | null
    partida_inmobiliaria?: StringNullableFilter<"expediente"> | string | null
    objeto?: StringNullableFilter<"expediente"> | string | null
    fecha_relevamiento?: DateTimeNullableFilter<"expediente"> | Date | string | null
    fecha_presentacion_municipalidad?: DateTimeNullableFilter<"expediente"> | Date | string | null
    expte_muni?: StringNullableFilter<"expediente"> | string | null
    certificado_catastral?: StringNullableFilter<"expediente"> | string | null
    informe_dominial?: StringNullableFilter<"expediente"> | string | null
    fecha_ingreso_dominio?: DateTimeNullableFilter<"expediente"> | Date | string | null
    fecha_egreso_dominio?: DateTimeNullableFilter<"expediente"> | Date | string | null
    titular?: StringNullableFilter<"expediente"> | string | null
    responsable?: StringNullableFilter<"expediente"> | string | null
    telefono_contacto?: StringNullableFilter<"expediente"> | string | null
    fecha_presupuesto?: DateTimeNullableFilter<"expediente"> | Date | string | null
    falta_relevar?: BoolNullableFilter<"expediente"> | boolean | null
    importe_presupuesto?: DecimalNullableFilter<"expediente"> | Decimal | DecimalJsLike | number | string | null
    entrega?: BoolNullableFilter<"expediente"> | boolean | null
    fecha_libre_deuda?: DateTimeNullableFilter<"expediente"> | Date | string | null
    aprobacion_muni?: BoolNullableFilter<"expediente"> | boolean | null
    disposicion_n?: StringNullableFilter<"expediente"> | string | null
    presentacion_dgc?: DateTimeNullableFilter<"expediente"> | Date | string | null
    expediente_n?: StringNullableFilter<"expediente"> | string | null
    previa_dgc?: DateTimeNullableFilter<"expediente"> | Date | string | null
    definitiva_dgc?: DateTimeNullableFilter<"expediente"> | Date | string | null
    visado_dgc?: DateTimeNullableFilter<"expediente"> | Date | string | null
    plano_registrado?: BoolNullableFilter<"expediente"> | boolean | null
    correccion?: BoolNullableFilter<"expediente"> | boolean | null
    campo1?: StringNullableFilter<"expediente"> | string | null
    terminado?: BoolNullableFilter<"expediente"> | boolean | null
  }

  export type expedienteOrderByWithRelationInput = {
    id?: SortOrder
    cliente?: SortOrderInput | SortOrder
    direccion?: SortOrderInput | SortOrder
    depto?: SortOrderInput | SortOrder
    municipio?: SortOrderInput | SortOrder
    seccion?: SortOrderInput | SortOrder
    chacra?: SortOrderInput | SortOrder
    manzana?: SortOrderInput | SortOrder
    parcela?: SortOrderInput | SortOrder
    lote?: SortOrderInput | SortOrder
    partida_inmobiliaria?: SortOrderInput | SortOrder
    objeto?: SortOrderInput | SortOrder
    fecha_relevamiento?: SortOrderInput | SortOrder
    fecha_presentacion_municipalidad?: SortOrderInput | SortOrder
    expte_muni?: SortOrderInput | SortOrder
    certificado_catastral?: SortOrderInput | SortOrder
    informe_dominial?: SortOrderInput | SortOrder
    fecha_ingreso_dominio?: SortOrderInput | SortOrder
    fecha_egreso_dominio?: SortOrderInput | SortOrder
    titular?: SortOrderInput | SortOrder
    responsable?: SortOrderInput | SortOrder
    telefono_contacto?: SortOrderInput | SortOrder
    fecha_presupuesto?: SortOrderInput | SortOrder
    falta_relevar?: SortOrderInput | SortOrder
    importe_presupuesto?: SortOrderInput | SortOrder
    entrega?: SortOrderInput | SortOrder
    fecha_libre_deuda?: SortOrderInput | SortOrder
    aprobacion_muni?: SortOrderInput | SortOrder
    disposicion_n?: SortOrderInput | SortOrder
    presentacion_dgc?: SortOrderInput | SortOrder
    expediente_n?: SortOrderInput | SortOrder
    previa_dgc?: SortOrderInput | SortOrder
    definitiva_dgc?: SortOrderInput | SortOrder
    visado_dgc?: SortOrderInput | SortOrder
    plano_registrado?: SortOrderInput | SortOrder
    correccion?: SortOrderInput | SortOrder
    campo1?: SortOrderInput | SortOrder
    terminado?: SortOrderInput | SortOrder
  }

  export type expedienteWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: expedienteWhereInput | expedienteWhereInput[]
    OR?: expedienteWhereInput[]
    NOT?: expedienteWhereInput | expedienteWhereInput[]
    cliente?: StringNullableFilter<"expediente"> | string | null
    direccion?: StringNullableFilter<"expediente"> | string | null
    depto?: StringNullableFilter<"expediente"> | string | null
    municipio?: IntNullableFilter<"expediente"> | number | null
    seccion?: IntNullableFilter<"expediente"> | number | null
    chacra?: IntNullableFilter<"expediente"> | number | null
    manzana?: IntNullableFilter<"expediente"> | number | null
    parcela?: StringNullableFilter<"expediente"> | string | null
    lote?: StringNullableFilter<"expediente"> | string | null
    partida_inmobiliaria?: StringNullableFilter<"expediente"> | string | null
    objeto?: StringNullableFilter<"expediente"> | string | null
    fecha_relevamiento?: DateTimeNullableFilter<"expediente"> | Date | string | null
    fecha_presentacion_municipalidad?: DateTimeNullableFilter<"expediente"> | Date | string | null
    expte_muni?: StringNullableFilter<"expediente"> | string | null
    certificado_catastral?: StringNullableFilter<"expediente"> | string | null
    informe_dominial?: StringNullableFilter<"expediente"> | string | null
    fecha_ingreso_dominio?: DateTimeNullableFilter<"expediente"> | Date | string | null
    fecha_egreso_dominio?: DateTimeNullableFilter<"expediente"> | Date | string | null
    titular?: StringNullableFilter<"expediente"> | string | null
    responsable?: StringNullableFilter<"expediente"> | string | null
    telefono_contacto?: StringNullableFilter<"expediente"> | string | null
    fecha_presupuesto?: DateTimeNullableFilter<"expediente"> | Date | string | null
    falta_relevar?: BoolNullableFilter<"expediente"> | boolean | null
    importe_presupuesto?: DecimalNullableFilter<"expediente"> | Decimal | DecimalJsLike | number | string | null
    entrega?: BoolNullableFilter<"expediente"> | boolean | null
    fecha_libre_deuda?: DateTimeNullableFilter<"expediente"> | Date | string | null
    aprobacion_muni?: BoolNullableFilter<"expediente"> | boolean | null
    disposicion_n?: StringNullableFilter<"expediente"> | string | null
    presentacion_dgc?: DateTimeNullableFilter<"expediente"> | Date | string | null
    expediente_n?: StringNullableFilter<"expediente"> | string | null
    previa_dgc?: DateTimeNullableFilter<"expediente"> | Date | string | null
    definitiva_dgc?: DateTimeNullableFilter<"expediente"> | Date | string | null
    visado_dgc?: DateTimeNullableFilter<"expediente"> | Date | string | null
    plano_registrado?: BoolNullableFilter<"expediente"> | boolean | null
    correccion?: BoolNullableFilter<"expediente"> | boolean | null
    campo1?: StringNullableFilter<"expediente"> | string | null
    terminado?: BoolNullableFilter<"expediente"> | boolean | null
  }, "id">

  export type expedienteOrderByWithAggregationInput = {
    id?: SortOrder
    cliente?: SortOrderInput | SortOrder
    direccion?: SortOrderInput | SortOrder
    depto?: SortOrderInput | SortOrder
    municipio?: SortOrderInput | SortOrder
    seccion?: SortOrderInput | SortOrder
    chacra?: SortOrderInput | SortOrder
    manzana?: SortOrderInput | SortOrder
    parcela?: SortOrderInput | SortOrder
    lote?: SortOrderInput | SortOrder
    partida_inmobiliaria?: SortOrderInput | SortOrder
    objeto?: SortOrderInput | SortOrder
    fecha_relevamiento?: SortOrderInput | SortOrder
    fecha_presentacion_municipalidad?: SortOrderInput | SortOrder
    expte_muni?: SortOrderInput | SortOrder
    certificado_catastral?: SortOrderInput | SortOrder
    informe_dominial?: SortOrderInput | SortOrder
    fecha_ingreso_dominio?: SortOrderInput | SortOrder
    fecha_egreso_dominio?: SortOrderInput | SortOrder
    titular?: SortOrderInput | SortOrder
    responsable?: SortOrderInput | SortOrder
    telefono_contacto?: SortOrderInput | SortOrder
    fecha_presupuesto?: SortOrderInput | SortOrder
    falta_relevar?: SortOrderInput | SortOrder
    importe_presupuesto?: SortOrderInput | SortOrder
    entrega?: SortOrderInput | SortOrder
    fecha_libre_deuda?: SortOrderInput | SortOrder
    aprobacion_muni?: SortOrderInput | SortOrder
    disposicion_n?: SortOrderInput | SortOrder
    presentacion_dgc?: SortOrderInput | SortOrder
    expediente_n?: SortOrderInput | SortOrder
    previa_dgc?: SortOrderInput | SortOrder
    definitiva_dgc?: SortOrderInput | SortOrder
    visado_dgc?: SortOrderInput | SortOrder
    plano_registrado?: SortOrderInput | SortOrder
    correccion?: SortOrderInput | SortOrder
    campo1?: SortOrderInput | SortOrder
    terminado?: SortOrderInput | SortOrder
    _count?: expedienteCountOrderByAggregateInput
    _avg?: expedienteAvgOrderByAggregateInput
    _max?: expedienteMaxOrderByAggregateInput
    _min?: expedienteMinOrderByAggregateInput
    _sum?: expedienteSumOrderByAggregateInput
  }

  export type expedienteScalarWhereWithAggregatesInput = {
    AND?: expedienteScalarWhereWithAggregatesInput | expedienteScalarWhereWithAggregatesInput[]
    OR?: expedienteScalarWhereWithAggregatesInput[]
    NOT?: expedienteScalarWhereWithAggregatesInput | expedienteScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"expediente"> | bigint | number
    cliente?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    direccion?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    depto?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    municipio?: IntNullableWithAggregatesFilter<"expediente"> | number | null
    seccion?: IntNullableWithAggregatesFilter<"expediente"> | number | null
    chacra?: IntNullableWithAggregatesFilter<"expediente"> | number | null
    manzana?: IntNullableWithAggregatesFilter<"expediente"> | number | null
    parcela?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    lote?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    partida_inmobiliaria?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    objeto?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    fecha_relevamiento?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    fecha_presentacion_municipalidad?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    expte_muni?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    certificado_catastral?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    informe_dominial?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    fecha_ingreso_dominio?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    fecha_egreso_dominio?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    titular?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    responsable?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    telefono_contacto?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    fecha_presupuesto?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    falta_relevar?: BoolNullableWithAggregatesFilter<"expediente"> | boolean | null
    importe_presupuesto?: DecimalNullableWithAggregatesFilter<"expediente"> | Decimal | DecimalJsLike | number | string | null
    entrega?: BoolNullableWithAggregatesFilter<"expediente"> | boolean | null
    fecha_libre_deuda?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    aprobacion_muni?: BoolNullableWithAggregatesFilter<"expediente"> | boolean | null
    disposicion_n?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    presentacion_dgc?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    expediente_n?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    previa_dgc?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    definitiva_dgc?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    visado_dgc?: DateTimeNullableWithAggregatesFilter<"expediente"> | Date | string | null
    plano_registrado?: BoolNullableWithAggregatesFilter<"expediente"> | boolean | null
    correccion?: BoolNullableWithAggregatesFilter<"expediente"> | boolean | null
    campo1?: StringNullableWithAggregatesFilter<"expediente"> | string | null
    terminado?: BoolNullableWithAggregatesFilter<"expediente"> | boolean | null
  }

  export type expedienteCreateInput = {
    id?: bigint | number
    cliente?: string | null
    direccion?: string | null
    depto?: string | null
    municipio?: number | null
    seccion?: number | null
    chacra?: number | null
    manzana?: number | null
    parcela?: string | null
    lote?: string | null
    partida_inmobiliaria?: string | null
    objeto?: string | null
    fecha_relevamiento?: Date | string | null
    fecha_presentacion_municipalidad?: Date | string | null
    expte_muni?: string | null
    certificado_catastral?: string | null
    informe_dominial?: string | null
    fecha_ingreso_dominio?: Date | string | null
    fecha_egreso_dominio?: Date | string | null
    titular?: string | null
    responsable?: string | null
    telefono_contacto?: string | null
    fecha_presupuesto?: Date | string | null
    falta_relevar?: boolean | null
    importe_presupuesto?: Decimal | DecimalJsLike | number | string | null
    entrega?: boolean | null
    fecha_libre_deuda?: Date | string | null
    aprobacion_muni?: boolean | null
    disposicion_n?: string | null
    presentacion_dgc?: Date | string | null
    expediente_n?: string | null
    previa_dgc?: Date | string | null
    definitiva_dgc?: Date | string | null
    visado_dgc?: Date | string | null
    plano_registrado?: boolean | null
    correccion?: boolean | null
    campo1?: string | null
    terminado?: boolean | null
  }

  export type expedienteUncheckedCreateInput = {
    id?: bigint | number
    cliente?: string | null
    direccion?: string | null
    depto?: string | null
    municipio?: number | null
    seccion?: number | null
    chacra?: number | null
    manzana?: number | null
    parcela?: string | null
    lote?: string | null
    partida_inmobiliaria?: string | null
    objeto?: string | null
    fecha_relevamiento?: Date | string | null
    fecha_presentacion_municipalidad?: Date | string | null
    expte_muni?: string | null
    certificado_catastral?: string | null
    informe_dominial?: string | null
    fecha_ingreso_dominio?: Date | string | null
    fecha_egreso_dominio?: Date | string | null
    titular?: string | null
    responsable?: string | null
    telefono_contacto?: string | null
    fecha_presupuesto?: Date | string | null
    falta_relevar?: boolean | null
    importe_presupuesto?: Decimal | DecimalJsLike | number | string | null
    entrega?: boolean | null
    fecha_libre_deuda?: Date | string | null
    aprobacion_muni?: boolean | null
    disposicion_n?: string | null
    presentacion_dgc?: Date | string | null
    expediente_n?: string | null
    previa_dgc?: Date | string | null
    definitiva_dgc?: Date | string | null
    visado_dgc?: Date | string | null
    plano_registrado?: boolean | null
    correccion?: boolean | null
    campo1?: string | null
    terminado?: boolean | null
  }

  export type expedienteUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    depto?: NullableStringFieldUpdateOperationsInput | string | null
    municipio?: NullableIntFieldUpdateOperationsInput | number | null
    seccion?: NullableIntFieldUpdateOperationsInput | number | null
    chacra?: NullableIntFieldUpdateOperationsInput | number | null
    manzana?: NullableIntFieldUpdateOperationsInput | number | null
    parcela?: NullableStringFieldUpdateOperationsInput | string | null
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    partida_inmobiliaria?: NullableStringFieldUpdateOperationsInput | string | null
    objeto?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_relevamiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fecha_presentacion_municipalidad?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expte_muni?: NullableStringFieldUpdateOperationsInput | string | null
    certificado_catastral?: NullableStringFieldUpdateOperationsInput | string | null
    informe_dominial?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_ingreso_dominio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fecha_egreso_dominio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    titular?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_contacto?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_presupuesto?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    falta_relevar?: NullableBoolFieldUpdateOperationsInput | boolean | null
    importe_presupuesto?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    entrega?: NullableBoolFieldUpdateOperationsInput | boolean | null
    fecha_libre_deuda?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aprobacion_muni?: NullableBoolFieldUpdateOperationsInput | boolean | null
    disposicion_n?: NullableStringFieldUpdateOperationsInput | string | null
    presentacion_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expediente_n?: NullableStringFieldUpdateOperationsInput | string | null
    previa_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    definitiva_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visado_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plano_registrado?: NullableBoolFieldUpdateOperationsInput | boolean | null
    correccion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    campo1?: NullableStringFieldUpdateOperationsInput | string | null
    terminado?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type expedienteUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    depto?: NullableStringFieldUpdateOperationsInput | string | null
    municipio?: NullableIntFieldUpdateOperationsInput | number | null
    seccion?: NullableIntFieldUpdateOperationsInput | number | null
    chacra?: NullableIntFieldUpdateOperationsInput | number | null
    manzana?: NullableIntFieldUpdateOperationsInput | number | null
    parcela?: NullableStringFieldUpdateOperationsInput | string | null
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    partida_inmobiliaria?: NullableStringFieldUpdateOperationsInput | string | null
    objeto?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_relevamiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fecha_presentacion_municipalidad?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expte_muni?: NullableStringFieldUpdateOperationsInput | string | null
    certificado_catastral?: NullableStringFieldUpdateOperationsInput | string | null
    informe_dominial?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_ingreso_dominio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fecha_egreso_dominio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    titular?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_contacto?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_presupuesto?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    falta_relevar?: NullableBoolFieldUpdateOperationsInput | boolean | null
    importe_presupuesto?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    entrega?: NullableBoolFieldUpdateOperationsInput | boolean | null
    fecha_libre_deuda?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aprobacion_muni?: NullableBoolFieldUpdateOperationsInput | boolean | null
    disposicion_n?: NullableStringFieldUpdateOperationsInput | string | null
    presentacion_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expediente_n?: NullableStringFieldUpdateOperationsInput | string | null
    previa_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    definitiva_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visado_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plano_registrado?: NullableBoolFieldUpdateOperationsInput | boolean | null
    correccion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    campo1?: NullableStringFieldUpdateOperationsInput | string | null
    terminado?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type expedienteCreateManyInput = {
    id?: bigint | number
    cliente?: string | null
    direccion?: string | null
    depto?: string | null
    municipio?: number | null
    seccion?: number | null
    chacra?: number | null
    manzana?: number | null
    parcela?: string | null
    lote?: string | null
    partida_inmobiliaria?: string | null
    objeto?: string | null
    fecha_relevamiento?: Date | string | null
    fecha_presentacion_municipalidad?: Date | string | null
    expte_muni?: string | null
    certificado_catastral?: string | null
    informe_dominial?: string | null
    fecha_ingreso_dominio?: Date | string | null
    fecha_egreso_dominio?: Date | string | null
    titular?: string | null
    responsable?: string | null
    telefono_contacto?: string | null
    fecha_presupuesto?: Date | string | null
    falta_relevar?: boolean | null
    importe_presupuesto?: Decimal | DecimalJsLike | number | string | null
    entrega?: boolean | null
    fecha_libre_deuda?: Date | string | null
    aprobacion_muni?: boolean | null
    disposicion_n?: string | null
    presentacion_dgc?: Date | string | null
    expediente_n?: string | null
    previa_dgc?: Date | string | null
    definitiva_dgc?: Date | string | null
    visado_dgc?: Date | string | null
    plano_registrado?: boolean | null
    correccion?: boolean | null
    campo1?: string | null
    terminado?: boolean | null
  }

  export type expedienteUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    depto?: NullableStringFieldUpdateOperationsInput | string | null
    municipio?: NullableIntFieldUpdateOperationsInput | number | null
    seccion?: NullableIntFieldUpdateOperationsInput | number | null
    chacra?: NullableIntFieldUpdateOperationsInput | number | null
    manzana?: NullableIntFieldUpdateOperationsInput | number | null
    parcela?: NullableStringFieldUpdateOperationsInput | string | null
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    partida_inmobiliaria?: NullableStringFieldUpdateOperationsInput | string | null
    objeto?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_relevamiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fecha_presentacion_municipalidad?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expte_muni?: NullableStringFieldUpdateOperationsInput | string | null
    certificado_catastral?: NullableStringFieldUpdateOperationsInput | string | null
    informe_dominial?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_ingreso_dominio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fecha_egreso_dominio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    titular?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_contacto?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_presupuesto?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    falta_relevar?: NullableBoolFieldUpdateOperationsInput | boolean | null
    importe_presupuesto?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    entrega?: NullableBoolFieldUpdateOperationsInput | boolean | null
    fecha_libre_deuda?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aprobacion_muni?: NullableBoolFieldUpdateOperationsInput | boolean | null
    disposicion_n?: NullableStringFieldUpdateOperationsInput | string | null
    presentacion_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expediente_n?: NullableStringFieldUpdateOperationsInput | string | null
    previa_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    definitiva_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visado_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plano_registrado?: NullableBoolFieldUpdateOperationsInput | boolean | null
    correccion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    campo1?: NullableStringFieldUpdateOperationsInput | string | null
    terminado?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type expedienteUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    depto?: NullableStringFieldUpdateOperationsInput | string | null
    municipio?: NullableIntFieldUpdateOperationsInput | number | null
    seccion?: NullableIntFieldUpdateOperationsInput | number | null
    chacra?: NullableIntFieldUpdateOperationsInput | number | null
    manzana?: NullableIntFieldUpdateOperationsInput | number | null
    parcela?: NullableStringFieldUpdateOperationsInput | string | null
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    partida_inmobiliaria?: NullableStringFieldUpdateOperationsInput | string | null
    objeto?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_relevamiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fecha_presentacion_municipalidad?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expte_muni?: NullableStringFieldUpdateOperationsInput | string | null
    certificado_catastral?: NullableStringFieldUpdateOperationsInput | string | null
    informe_dominial?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_ingreso_dominio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fecha_egreso_dominio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    titular?: NullableStringFieldUpdateOperationsInput | string | null
    responsable?: NullableStringFieldUpdateOperationsInput | string | null
    telefono_contacto?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_presupuesto?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    falta_relevar?: NullableBoolFieldUpdateOperationsInput | boolean | null
    importe_presupuesto?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    entrega?: NullableBoolFieldUpdateOperationsInput | boolean | null
    fecha_libre_deuda?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    aprobacion_muni?: NullableBoolFieldUpdateOperationsInput | boolean | null
    disposicion_n?: NullableStringFieldUpdateOperationsInput | string | null
    presentacion_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expediente_n?: NullableStringFieldUpdateOperationsInput | string | null
    previa_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    definitiva_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visado_dgc?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plano_registrado?: NullableBoolFieldUpdateOperationsInput | boolean | null
    correccion?: NullableBoolFieldUpdateOperationsInput | boolean | null
    campo1?: NullableStringFieldUpdateOperationsInput | string | null
    terminado?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type expedienteCountOrderByAggregateInput = {
    id?: SortOrder
    cliente?: SortOrder
    direccion?: SortOrder
    depto?: SortOrder
    municipio?: SortOrder
    seccion?: SortOrder
    chacra?: SortOrder
    manzana?: SortOrder
    parcela?: SortOrder
    lote?: SortOrder
    partida_inmobiliaria?: SortOrder
    objeto?: SortOrder
    fecha_relevamiento?: SortOrder
    fecha_presentacion_municipalidad?: SortOrder
    expte_muni?: SortOrder
    certificado_catastral?: SortOrder
    informe_dominial?: SortOrder
    fecha_ingreso_dominio?: SortOrder
    fecha_egreso_dominio?: SortOrder
    titular?: SortOrder
    responsable?: SortOrder
    telefono_contacto?: SortOrder
    fecha_presupuesto?: SortOrder
    falta_relevar?: SortOrder
    importe_presupuesto?: SortOrder
    entrega?: SortOrder
    fecha_libre_deuda?: SortOrder
    aprobacion_muni?: SortOrder
    disposicion_n?: SortOrder
    presentacion_dgc?: SortOrder
    expediente_n?: SortOrder
    previa_dgc?: SortOrder
    definitiva_dgc?: SortOrder
    visado_dgc?: SortOrder
    plano_registrado?: SortOrder
    correccion?: SortOrder
    campo1?: SortOrder
    terminado?: SortOrder
  }

  export type expedienteAvgOrderByAggregateInput = {
    id?: SortOrder
    municipio?: SortOrder
    seccion?: SortOrder
    chacra?: SortOrder
    manzana?: SortOrder
    importe_presupuesto?: SortOrder
  }

  export type expedienteMaxOrderByAggregateInput = {
    id?: SortOrder
    cliente?: SortOrder
    direccion?: SortOrder
    depto?: SortOrder
    municipio?: SortOrder
    seccion?: SortOrder
    chacra?: SortOrder
    manzana?: SortOrder
    parcela?: SortOrder
    lote?: SortOrder
    partida_inmobiliaria?: SortOrder
    objeto?: SortOrder
    fecha_relevamiento?: SortOrder
    fecha_presentacion_municipalidad?: SortOrder
    expte_muni?: SortOrder
    certificado_catastral?: SortOrder
    informe_dominial?: SortOrder
    fecha_ingreso_dominio?: SortOrder
    fecha_egreso_dominio?: SortOrder
    titular?: SortOrder
    responsable?: SortOrder
    telefono_contacto?: SortOrder
    fecha_presupuesto?: SortOrder
    falta_relevar?: SortOrder
    importe_presupuesto?: SortOrder
    entrega?: SortOrder
    fecha_libre_deuda?: SortOrder
    aprobacion_muni?: SortOrder
    disposicion_n?: SortOrder
    presentacion_dgc?: SortOrder
    expediente_n?: SortOrder
    previa_dgc?: SortOrder
    definitiva_dgc?: SortOrder
    visado_dgc?: SortOrder
    plano_registrado?: SortOrder
    correccion?: SortOrder
    campo1?: SortOrder
    terminado?: SortOrder
  }

  export type expedienteMinOrderByAggregateInput = {
    id?: SortOrder
    cliente?: SortOrder
    direccion?: SortOrder
    depto?: SortOrder
    municipio?: SortOrder
    seccion?: SortOrder
    chacra?: SortOrder
    manzana?: SortOrder
    parcela?: SortOrder
    lote?: SortOrder
    partida_inmobiliaria?: SortOrder
    objeto?: SortOrder
    fecha_relevamiento?: SortOrder
    fecha_presentacion_municipalidad?: SortOrder
    expte_muni?: SortOrder
    certificado_catastral?: SortOrder
    informe_dominial?: SortOrder
    fecha_ingreso_dominio?: SortOrder
    fecha_egreso_dominio?: SortOrder
    titular?: SortOrder
    responsable?: SortOrder
    telefono_contacto?: SortOrder
    fecha_presupuesto?: SortOrder
    falta_relevar?: SortOrder
    importe_presupuesto?: SortOrder
    entrega?: SortOrder
    fecha_libre_deuda?: SortOrder
    aprobacion_muni?: SortOrder
    disposicion_n?: SortOrder
    presentacion_dgc?: SortOrder
    expediente_n?: SortOrder
    previa_dgc?: SortOrder
    definitiva_dgc?: SortOrder
    visado_dgc?: SortOrder
    plano_registrado?: SortOrder
    correccion?: SortOrder
    campo1?: SortOrder
    terminado?: SortOrder
  }

  export type expedienteSumOrderByAggregateInput = {
    id?: SortOrder
    municipio?: SortOrder
    seccion?: SortOrder
    chacra?: SortOrder
    manzana?: SortOrder
    importe_presupuesto?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
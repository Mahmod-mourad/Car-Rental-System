import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
export declare abstract class BaseRepository<T extends ObjectLiteral> {
    private readonly repository;
    constructor(repository: Repository<T>);
    find(options?: FindManyOptions<T>): Promise<T[]>;
    findOne(options: FindOneOptions<T>): Promise<T | null>;
    findOneBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null>;
    findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
    create(entity: DeepPartial<T>): Promise<T>;
    update(criteria: string | number | FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult>;
    delete(criteria: string | number | FindOptionsWhere<T>): Promise<void>;
    count(options?: FindManyOptions<T>): Promise<number>;
}

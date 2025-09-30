"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async find(options) {
        return this.repository.find(options);
    }
    async findOne(options) {
        return this.repository.findOne(options);
    }
    async findOneBy(where) {
        return this.repository.findOneBy(where);
    }
    async findAndCount(options) {
        return this.repository.findAndCount(options);
    }
    async create(entity) {
        const newEntity = this.repository.create(entity);
        return this.repository.save(newEntity);
    }
    async update(criteria, partialEntity) {
        return this.repository.update(criteria, partialEntity);
    }
    async delete(criteria) {
        await this.repository.delete(criteria);
    }
    async count(options) {
        return this.repository.count(options);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map
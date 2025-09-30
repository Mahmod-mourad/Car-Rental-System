import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("../database/entities").User>;
    findAll(): Promise<import("../database/entities").User[]>;
    findOne(id: string): Promise<import("../database/entities").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../database/entities").User>;
    remove(id: string): Promise<void>;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';
import { VehiclesService, SearchFilters } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { Min, Max } from 'class-validator';

@ApiTags('Vehicles')
@Controller('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new vehicle (Agents and Admins only)' })
  @ApiResponse({ status: 201, description: 'Vehicle successfully created', type: Vehicle })
  create(@Body() createVehicleDto: CreateVehicleDto, @Req() req) {
    return this.vehiclesService.create(createVehicleDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all vehicles with optional filters',
    description: `Search and filter vehicles based on various criteria. 
      - Filter by make, model, year, type, and price range
      - Search by location (latitude/longitude)
      - Filter by availability and featured status
      - Pagination support`
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved list of vehicles', 
    type: [Vehicle],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiQuery({ name: 'make', required: false, description: 'Filter by vehicle make (e.g., Toyota, Honda)' })
  @ApiQuery({ name: 'model', required: false, description: 'Filter by vehicle model (e.g., Camry, Civic)' })
  @ApiQuery({ 
    name: 'minYear', 
    required: false, 
    type: Number, 
    description: 'Filter by minimum manufacturing year' 
  })
  @ApiQuery({ 
    name: 'maxYear', 
    required: false, 
    type: Number, 
    description: 'Filter by maximum manufacturing year' 
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    description: 'Filter by vehicle type (e.g., SEDAN, SUV, TRUCK)' 
  })
  @ApiQuery({ 
    name: 'minPrice', 
    required: false, 
    type: Number, 
    description: 'Filter by minimum daily rental price' 
  })
  @ApiQuery({ 
    name: 'maxPrice', 
    required: false, 
    type: Number, 
    description: 'Filter by maximum daily rental price' 
  })
  @ApiQuery({ 
    name: 'minRating', 
    required: false, 
    type: Number, 
    description: 'Filter by minimum average rating (1-5)' 
  })
  @ApiQuery({ 
    name: 'isFeatured', 
    required: false, 
    type: 'boolean', 
    description: 'Filter only featured vehicles' 
  })
  @ApiQuery({ 
    name: 'available', 
    required: false, 
    type: 'boolean', 
    description: 'Filter only currently available vehicles' 
  })
  @ApiQuery({ 
    name: 'lat', 
    required: false, 
    type: Number, 
    description: 'Latitude for location-based search' 
  })
  @ApiQuery({ 
    name: 'lng', 
    required: false, 
    type: Number, 
    description: 'Longitude for location-based search' 
  })
  @ApiQuery({ 
    name: 'radiusKm', 
    required: false, 
    type: Number, 
    description: 'Search radius in kilometers (default: 50km)' 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number for pagination (default: 1)' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Number of items per page (default: 10, max: 100)' 
  })
  async findAll(
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('minYear', new DefaultValuePipe(0), ParseIntPipe) minYear?: number,
    @Query('maxYear', new DefaultValuePipe(3000), ParseIntPipe) maxYear?: number,
    @Query('type') type?: string,
    @Query('minPrice', new DefaultValuePipe(0), ParseIntPipe) minPrice?: number,
    @Query('maxPrice', new DefaultValuePipe(1000000), ParseIntPipe) maxPrice?: number,
    @Query('minRating')
    minRating?: number,
    @Query('isFeatured') isFeatured?: string,
    @Query('available') available?: boolean,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
    @Query('radiusKm', new DefaultValuePipe(50), ParseIntPipe) radiusKm?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    const filters: SearchFilters = {
      make,
      model,
      minYear,
      maxYear,
      type,
      minPrice,
      maxPrice,
      minRating: minRating ? Math.min(5, Math.max(1, Number(minRating))) : undefined,
      isFeatured: isFeatured ? isFeatured.toLowerCase() === 'true' : undefined,
      available,
      page,
      limit,
    };

    if (lat && lng) {
      filters.location = {
        lat,
        lng,
        radiusKm,
      };
    }

    return this.vehiclesService.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ 
    summary: 'Get featured vehicles',
    description: 'Returns a list of featured vehicles, sorted by highest rating and most recent. Featured vehicles are typically highlighted for better visibility.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved list of featured vehicles', 
    type: [Vehicle] 
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid limit parameter'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Maximum number of featured vehicles to return (default: 6, max: 20)',
    example: 6
  })
  async getFeaturedVehicles(@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number) {
    if (limit < 1 || limit > 20) {
      throw new BadRequestException('Limit must be between 1 and 20');
    }
    return this.vehiclesService.findFeatured(limit);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest vehicles' })
  @ApiResponse({ status: 200, description: 'Return list of latest vehicles', type: [Vehicle] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of vehicles to return (default: 6)' })
  async getLatestVehicles(@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number) {
    if (limit < 1 || limit > 20) {
      throw new BadRequestException('Limit must be between 1 and 20');
    }
    return this.vehiclesService.findLatest(limit);
  }

  @Get('similar/:id')
  @ApiOperation({ summary: 'Get similar vehicles' })
  @ApiResponse({ status: 200, description: 'Return list of similar vehicles', type: [Vehicle] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of vehicles to return (default: 4)' })
  async getSimilarVehicles(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number
  ) {
    if (limit < 1 || limit > 10) {
      throw new BadRequestException('Limit must be between 1 and 10');
    }
    return this.vehiclesService.findSimilar(id, limit);
  }

  @Get('brands/popular')
  @ApiOperation({ summary: 'Get popular car brands' })
  @ApiResponse({ status: 200, description: 'Return list of popular car brands with vehicle counts' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of brands to return (default: 5)' })
  async getPopularBrands(@Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number) {
    if (limit < 1 || limit > 20) {
      throw new BadRequestException('Limit must be between 1 and 20');
    }
    return this.vehiclesService.getPopularBrands(limit);
  }

  @Get('price-range')
  @ApiOperation({ summary: 'Get price range of available vehicles' })
  @ApiResponse({ status: 200, description: 'Return min and max price of available vehicles' })
  async getPriceRange() {
    return this.vehiclesService.getPriceRange();
  }

  @Get('my-vehicles')
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all vehicles owned by the current user (Agents and Admins only)' })
  @ApiResponse({ status: 200, description: 'Return list of vehicles', type: [Vehicle] })
  findUserVehicles(@Req() req) {
    return this.vehiclesService.findUserVehicles(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Return the vehicle', type: Vehicle })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully', type: Vehicle })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Req() req,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto, req.user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a vehicle (Agents and Admins only)' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  remove(@Param('id') id: string, @Req() req) {
    return this.vehiclesService.remove(id, req.user.userId);
  }

  @Patch(':id/availability')
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update vehicle availability (Agents and Admins only)' })
  @ApiResponse({ status: 200, description: 'Vehicle availability updated', type: Vehicle })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  updateAvailability(
    @Param('id') id: string,
    @Body('available') available: boolean,
    @Req() req,
  ) {
    return this.vehiclesService.updateAvailability(id, available, req.user.userId);
  }
}

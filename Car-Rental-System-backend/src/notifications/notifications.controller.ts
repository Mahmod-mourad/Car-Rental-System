import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "List the signed-in user's notifications" })
  @ApiResponse({
    status: 200,
    description: 'Notifications plus the unread count',
  })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    // Notifications are always read for the caller. There is no user id parameter
    // to tamper with.
    return this.notificationsService.findForUser(req.user.userId, {
      unreadOnly: unreadOnly === 'true',
      page,
      limit,
    });
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark one notification as read' })
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark every unread notification as read' })
  async markAllAsRead(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete one notification' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.notificationsService.remove(id, req.user.userId);
  }
}

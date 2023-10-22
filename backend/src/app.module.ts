import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConnectionService } from "./database-connection.service";
import { AuthModule } from "./auth/auth.module";
import { TileModule } from "./tile/tile.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    AuthModule,
    TileModule,
  ],
})
export class AppModule {}

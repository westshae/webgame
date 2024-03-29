// app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConnectionService } from "./database-connection.service";
import { AuthModule } from "./auth/auth.module";
import { TileModule } from "./tile/tile.module";
import { GameloopModule } from "./gameloop/gameloop.module";
import { StateModule } from "./state/state.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    TypeOrmModule.forFeature([]), // Add this line to specify the migrations configuration for entities
    AuthModule,
    TileModule,
    GameloopModule,
    StateModule,
  ]
})
export class AppModule {}

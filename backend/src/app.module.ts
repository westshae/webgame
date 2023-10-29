// app.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConnectionService } from "./database-connection.service";
import { AuthModule } from "./auth/auth.module";
import { TileModule } from "./tile/tile.module";
import { GameloopModule } from "./gameloop/gameloop.module";
import { DecisionModule } from "./decisions/decisions.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    AuthModule,
    TileModule,
    GameloopModule,
    DecisionModule,
    UserModule
  ],
  providers: [],
})
export class AppModule {}

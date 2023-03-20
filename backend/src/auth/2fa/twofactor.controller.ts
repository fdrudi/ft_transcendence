import { ClassSerializerInterceptor, Controller, Header, Post, UseInterceptors, Res, UseGuards, Req, HttpCode, Body, UnauthorizedException, Get } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response, response } from 'express';
import JwtAuthenticationGuard from '../guard/jwt.guard';
import RequestWithUser from '../interface/requestWithUser.interface';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthenticationCodeDto } from './twoFactor.dto';
import { AuthService } from '../auth.service';
import { toFileStream, toFile, toDataURL } from 'qrcode';
import { AuthGuard } from '@nestjs/passport';
import User from 'src/users/user.entity';
import { UserDto } from 'src/users/user.dto';
import { JsonContains } from 'typeorm';
import JwtTwoFactorGuard from '../guard/2fa-jwt.guard';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly usersService: UsersService,
		private readonly authenticationService: AuthService,
	) {}
	/*------------------ GENERATE -----------------------------------------
      La chiamata generate genera un codice QR e quindi un secret che va ad associare
      all'id dell'utente con il quale solo lui potrà autenticarsi
   ---------------------------------------------------------------------------*/
	@Post('generate')
	@UseGuards(JwtAuthenticationGuard)
	async register(@Req() request: RequestWithUser) {
		const { otpAuthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
		return toDataURL(otpAuthUrl);
	}

	/*------------------ TURN-ON -----------------------------------------
      La chiamata Turn-on va a cambiare lo stato da false a true  di isTwoFactorAuthenticationEnabled
      se questo non è attivo al login non potrà accedere all'autenticazione a 2fattori
    -----------------------------------------------------------------------*/
	@Post('turn-on')
	@HttpCode(200)
	@UseGuards(JwtAuthenticationGuard)
	async turnOnTwoFactorAuthentication(@Req() request: RequestWithUser) {
		await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
	}

	/*------------------ TURN-OFF -----------------------------------------
      La chiamata Turn-off va a cambiare lo stato da true a false  di isTwoFactorAuthenticationEnabled,
      e risetta i cookie del jwt per poter accedere ai precedenti servizi e chiamate
      protette da jwt
    ------------------ TURN-OFF -----------------------------------------*/
	@Post('turn-off')
	@HttpCode(200)
	@UseGuards(JwtTwoFactorGuard)
	async turnOffTwoFactorAuthentication(@Req() request: RequestWithUser, @Res({ passthrough: true }) response: Response) {
		const cookie = this.authenticationService.getCookieWithJwtToken(request.user.id);
		response.setHeader('Set-Cookie', cookie);
		await this.usersService.turnOffTwoFactorAuthentication(request.user.id);
		return request.user;
	}

	/*------------------ AUTHENTICATE -----------------------------------------
      La chiamata di Autenticazione serve a convalidare il codice  ottenuto dal QR e passarlo
      nella stringa twoFactorAuthenticationCode del body, se valida ottieni
      il cookie a 2 fattori altrimenti ritorna codice non valido
    --------------------------------------------------------------------------*/
	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(JwtAuthenticationGuard)
	async authenticate(@Req() request: RequestWithUser, @Body() twoFacAuthCode: TwoFactorAuthenticationCodeDto) {
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
			twoFacAuthCode.twoFactorAuthenticationCode,
			<string>request.user.twoFactorAuthenticationSecret,
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
		request.res.setHeader('Set-Cookie', [accessTokenCookie]);
		return request.user;
	}
}

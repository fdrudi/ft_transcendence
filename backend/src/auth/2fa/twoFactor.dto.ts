import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorAuthenticationCodeDto {
	@IsString()
	@IsNotEmpty()
	twoFactorAuthenticationCode: string;
	constructor(twoFactorAuthenticationCode: any) {
		this.twoFactorAuthenticationCode = twoFactorAuthenticationCode;
	}
}

export default TwoFactorAuthenticationCodeDto;

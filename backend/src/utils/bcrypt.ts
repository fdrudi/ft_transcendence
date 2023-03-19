
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';

export async function encodePassword(rawPassword: string) {
	const salt = bcrypt.genSaltSync();

	return bcrypt.hash(rawPassword, salt);
}

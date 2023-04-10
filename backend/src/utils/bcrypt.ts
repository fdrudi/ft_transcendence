/* eslint-disable @typescript-eslint/no-empty-function */
import * as bcrypt from 'bcrypt';

export async function encodePassword(rawPassword: string) {
	const salt = bcrypt.genSaltSync();

	return bcrypt.hash(rawPassword, salt);
}

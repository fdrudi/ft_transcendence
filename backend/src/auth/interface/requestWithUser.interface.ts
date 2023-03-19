import { Request } from 'express';
import User from '../../users/user.entity';

interface RequestWithUser extends Request {
	res: any;
	user: User;
}

export default RequestWithUser;

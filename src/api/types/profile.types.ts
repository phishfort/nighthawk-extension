export interface IUserInfo {
	id: string;
	isSharingData: boolean;
	google: string | null;
	createdAt: string;
	twitter: string | null;
	username: string;
	updatedAt: string;
	password: string;
	email: string;
	guardianPoints: number;
}

export interface Iuuid {
	id: string;
}

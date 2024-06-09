import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';

const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

export default defineEventHandler(async (event) => {
	const form = formidable({ multiples: false, uploadDir, maxFileSize: 1 * 1024 * 1024 });

	const [fields, files] = await form.parse(event.req);

	let imageUrl = null;
	if (files.image.length) {
		const fileName = files.image[0].newFilename;
		imageUrl = `/uploads/${fileName}`;
	}

	const data = {
		title: fields.title[0],
		description: fields.description[0],
		price: parseFloat(fields.price[0]),
		image: imageUrl,
	};
	const product = await prisma.product.create({ data });
	return product;
})

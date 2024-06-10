import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import { MAX_IMAGE_SIZE } from '~/utills/constants';

const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

export default defineEventHandler(async (event) => {
	const form = formidable({ multiples: false, uploadDir });
	const [fields, files] = await form.parse(event.req);

	if (!fields.title?.[0]) {
		throw createError({ statusCode: 400, statusMessage: 'No product title has been sent' })
	}
	if (!fields.description?.[0]) {
		throw createError({ statusCode: 400, statusMessage: 'No product description has been sent' })
	}
	if (!fields.price) {
		throw createError({ statusCode: 400, statusMessage: 'No product price has been sent' })
	}
	if (fields.price[0] <= 0) {
		throw createError({ statusCode: 400, statusMessage: 'The price must be greater than 0' })
	}
	if (!files.image?.[0]) {
		throw createError({ statusCode: 400, statusMessage: 'No product image has been sent' })
	}
	if (files.image[0].size > MAX_IMAGE_SIZE) {
		throw createError({ statusCode: 400, statusMessage: 'The image is too large' })
	}

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

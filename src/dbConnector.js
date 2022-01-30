import mongoose from 'mongoose';
//adres dostępu do bazy danych - lokalizacja: konfiguracja Heroku
const uri = process.env.MongooseURI;

//odpowiada za łączenie się z bazą danych
export const connectDB = async () => {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log('MongoDB connected!!');
	} catch (err) {
		console.log('Failed to connect to MongoDB', err);
	}
};

export let db = mongoose.connection;

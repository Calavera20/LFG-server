//Plik konfiguracyjny - wartości zmiennych process.env. 
//znajdują się jedynie w konfiguracji platformy hostingowej Heroku

//Sekret JWT służący do weryfikacji i podpisywania tokenów JWT
JWTSecret = process.env.JWT_SECRET;

//token połączenia z bazą MongoDB
MongooseUri = process.env.MongooseURI;
function connectToDb() {
    mongoose.connect("mongodb+srv://harshit:r1pyA35jac2pvqW8@cluster0.klwos4s.mongodb.net/day-7")
    .then(()=>{console.log("connected to Database day-7")})
}

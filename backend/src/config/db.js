const mongoose =
  require("mongoose");


// ==========================================
// CONNECT DATABASE
// ==========================================
const connectDB =
  async () => {

    try {

      // ====================================
      // CHECK ENV VARIABLE
      // ====================================
      if (
        !process.env.MONGO_URI
      ) {

        console.log(
          "❌ MONGO_URI Missing"
        );

        process.exit(1);

      }


      // ====================================
      // CONNECT MONGODB
      // ====================================
      const conn =
        await mongoose.connect(

          process.env.MONGO_URI,

          {

            autoIndex: true,

          }

        );


      // ====================================
      // SUCCESS MESSAGE
      // ====================================
      console.log(

        `✅ MongoDB Connected: ${conn.connection.host}`

      );


      // ====================================
      // CONNECTION EVENTS
      // ====================================
      mongoose.connection.on(

        "error",

        (error) => {

          console.log(

            "❌ MongoDB Error:",

            error.message

          );

        }

      );


      mongoose.connection.on(

        "disconnected",

        () => {

          console.log(
            "⚠️ MongoDB Disconnected"
          );

        }

      );

    }

    catch (error) {

      console.log(

        "❌ DATABASE CONNECTION ERROR:",

        error.message

      );

      process.exit(1);

    }

  };


// ==========================================
// EXPORT
// ==========================================
module.exports =
  connectDB;
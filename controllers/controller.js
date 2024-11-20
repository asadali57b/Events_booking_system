const User=require("../models/userModel");
const Event=require("../models/eventModel");
const Ticket=require("../models/ticketModel");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const QRCode = require('qrcode');
const {sendTicketEmail}=require("../utils/sendEmail");
const {signinSchema,SignupSchema}=require('../utils/validation')
const { generateTicketImage } = require('../utils/ticketImage'); 


exports.createUser=async(req,res)=>{
  const {name,email,password}=req.body;
    try {
       const {error}=SignupSchema.validate(req.body);
       if(error){
        return res.status(400).json({
            msg:"User Creation Failed",
            data:error
        })
       }
let user=await User.findOne({email:email});
if(user){
    return res.status(400).json({
        msg:"User Creation Failed",
        data:"User Already Exists"
    })
}
const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            name,
            email,
            password:hashedPassword
        })

        await newUser.save();
        res.status(201).json({
            msg:"User Created",
            data:newUser
        })
    } catch (error) {
        res.status(400).json({
            msg:"User Creation Failed",
            data:error
        })
    }
}

exports.loginUser=async(req,res)=>{
    try {
      const {error}=signinSchema.validate(req.body);
      if(error){
        return res.status(400).json({
            msg:"Login Failed",
            data:error
        })
      }
        const user=await User.findOne({email:req.body.email});
        if(!user){
            return res.status(401).json({
                msg:"Login Failed",
                data:"Invalid Credentials"
            });
          }

            const isValidPassword=await bcrypt.compare(req.body.password,user.password);
            if(!isValidPassword){
                return res.status(401).json({
                    msg:"Login Failed",
                    data:"Invalid Credentials"
                });
            }

            const token=jwt.sign({id:user._id},'userData',{expiresIn:"24hr"});
            user.token=token;
            await user.save();

            res.status(200).json({
            msg:"Login Successfull",
            data:user
        });
    } catch (error) {
        res.status(400).json({
            msg:"Login Failed",
            data:error
        })
    }
}

exports.createEvent=async(req,res)=>{
    try {
        const {name,location,date,ticketsAvailable,price}=req.body;
        
        const event=new Event(req.body);
        await event.save();
        res.status(201).json({
            msg:"Event Created",
            data:event
        });
    } catch (error) {
        res.status(400).send(error);
    }
}


exports.purchaseTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User ID not found.' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.ticketsAvailable <= 0) {
      return res.status(400).json({ success: false, message: 'No tickets available' });
    }

    const qrCodeContent = `${eventId}-${userId}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeContent);

    const ticket = new Ticket({
      eventId,
      userId,
      ticketDetails: {
        name: event.name,
        location: event.location,
        date: event.date,
        price: event.price,
      },
      qrCode: qrCodeImage, 
    });

    await ticket.save();

    
    event.ticketsAvailable -= 1;
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Ticket purchased successfully',
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.validateTicket = async (req, res) => {
  try {
    const { qrCodeContent } = req.body;

    const ticket = await Ticket.findOne({ qrCode: qrCodeContent });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Invalid Ticket",
      });
    }

    if (!ticket.isValid) {
      return res.status(400).json({
        success: false,
        message: "Ticket Already Used",
      });
    }

    ticket.isValid = false;
    await ticket.save();

    const user = await User.findById(ticket.userId);
    if (!user || !user.email) {
      console.warn(`User or email not found for userId: ${ticket.userId}`);
    } else {
      try {
        const ticketImage = await generateTicketImage(ticket.ticketDetails);

        await sendTicketEmail(
          user.email,
          ticket.ticketDetails.name,
          ticket.ticketDetails.location,
          ticket.ticketDetails.date,
          ticket.ticketDetails.price,
          ticketImage
        );
        console.log(`Validation email sent to: ${user.email}`);
      } catch (emailError) {
        console.error("Error sending email:", emailError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Ticket Validated",
      data: ticket,
    });
  } catch (error) {
    console.error("Error validating ticket:", error.message);
    res.status(500).json({
      success: false,
      message: "Ticket Validation Failed",
      error: error.message,
    });
  }
};


  exports.updateEvent=async(req,res)=>{
    const {eventId,name,location,date,ticketsAvailable,price}=req.body;
    try {
        const event=await Event.findById(eventId);
        if(!event){
            return res.status(404).json({
                msg:"Event Updation Failed",
                data:"Event Not Found"
            })
        }
        event.name=name;
        event.location=location;
        event.date=date;
        event.ticketsAvailable=ticketsAvailable;
        event.price=price;
        await event.save();
       const tickets=await Ticket.find({eventId:eventId});
       if(tickets.length>0){
         const updates=tickets.map(async(ticket)=>{
           ticket.eventId=event._id;
         })
       }


        res.status(200).json({
            msg:"Event Updated",
            data:event
        })
    } catch (error) {
        res.status(400).json({
            msg:"Event Updation Failed",
            data:error
        })
    }
        }

exports.deleteEvent=async(req,res)=>{
    try {
        const {eventId}=req.body;
        const event=await Event.findByIdAndDelete(eventId);

        if(!event){
            return res.status(404).json({
                msg:"Event Deletion Failed",
                data:"Event Not Found"
            })
        }
        res.status(200).json({
            msg:"Event Deleted",
            data:event
        })
    } catch (error) {
        res.status(400).json({
            msg:"Event Deletion Failed",
            data:error
        })
    }
}
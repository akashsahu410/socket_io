let express=require('express')
let app=express()
let _ =require('lodash')
//app setup
let socket=require('socket.io')
let server=app.listen(4000,()=>{
	console.log("server is running at 4000 port")
})
let users=[]
//socket setup
let io=socket(server)
io.on('connection',(socket)=>{
	console.log("Connected Socked Id: ",socket.id)

	//to store the users
	socket.on('setUser',(data)=>{
		console.log("inside set user",data)
		users.push(data)
		io.sockets.emit('setUser',users)
		console.log("new users",users)
	})

	//disconnect on refersh
	socket.on('disconnect',()=>{
		console.log("user disconnected",socket.id)
		_.remove(users, {socketid: socket.id})
		io.sockets.emit('setUser',users)
	})

	//to listen the message send by user
	socket.on('chat',(data)=>{
		console.log("data of msg",data)
		io.sockets.emit('chat',data)		//to return back the data to front end
	})

	//to listen the typing onkeypress event
	socket.on('typing',(data)=>{
		// console.log("data of typing")
		socket.broadcast.emit('typing',data)	//to return the typing data to front end
	})

	socket.on('one_typing',(data)=>{
		// console.log("data of typing")
		io.sockets.emit('one_typing',data)	//to return the typing data to front end
	})
	//one to one chat with users
	socket.on('current_user',(data)=>{
		console.log("inside the current user",data)
		io.sockets.emit('current_user',data)
	})

	socket.on('one_chat',(data)=>{
		console.log("data of one to one msg",data)
		io.sockets.emit('one_chat',data)		//to return back the data to front end
	})
}) 

//static files
app.use(express.static(__dirname + '/public'))

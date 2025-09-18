import { server } from './app'

<<<<<<< HEAD
const PORT = process.env.PORT || 4000
=======
const PORT = process.env.PORT || 3000
>>>>>>> e9e2b4d04e0172ab4568bfcddf0a5ee1c9ed73ab

server.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`)
})

'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '../firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

// Neon styles for modal and buttons
const neonStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#1a1a1a',
  border: '2px solid #00f9ff',
  boxShadow: '0 0 15px rgba(0, 249, 255, 0.7)',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  borderRadius: 8,
}

const neonButtonStyle = {
  bgcolor: 'transparent',
  color: '#00f9ff',
  border: '2px solid #00f9ff',
  boxShadow: '0 0 10px rgba(0, 249, 255, 0.7)',
  '&:hover': {
    bgcolor: '#00bcd4',
    color: '#000',
    borderColor: '#00bcd4',
    boxShadow: '0 0 15px rgba(0, 188, 212, 0.9)',
  },
  transition: 'all 0.3s ease-in-out',
  borderRadius: 4,
  textTransform: 'uppercase',
}

export default function Home() {
  const [inventory, setInventory] = useState([]) // State to hold inventory items
  const [open, setOpen] = useState(false) // State to control modal visibility
  const [itemName, setItemName] = useState('') // State for the item name input

  // Fetch inventory data from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory() // Fetch inventory on component mount
  }, [])

  // Add item to inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory() // Refresh inventory list
  }

  // Remove item from inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory() // Refresh inventory list
  }

  // Reset inventory
  const resetInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    docs.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })
    await updateInventory() // Refresh inventory list
  }

  // Open and close modal handlers
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      bgcolor={'#0f0f0f'}
      sx={{
        backgroundImage: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #00f9ff 100%)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        color: 'white',
      }}
    >
      {/* Modal for adding new inventory item */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={neonStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="#00f9ff">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              InputProps={{ style: { color: '#00f9ff' } }}
              InputLabelProps={{ style: { color: '#00f9ff' } }}
            />
            <Button
              variant="outlined"
              sx={{ ...neonButtonStyle, borderColor: '#00f9ff', color: '#00f9ff' }}
              onClick={() => {
                addItem(itemName) // Add item to inventory
                setItemName('') // Clear input field
                handleClose() // Close modal
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Main content box displaying inventory items */}
      <Box
        border={'2px solid #00f9ff'}
        borderRadius={8}
        overflow="hidden"
        width="800px"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgcolor={'#1a1a1a'}
          borderBottom={'2px solid #00f9ff'}
          paddingX={2}
          paddingY={1}
        >
          <Typography variant={'h2'} color={'#00f9ff'}>
            Inventory Items
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              sx={neonButtonStyle}
              onClick={resetInventory} // Reset inventory
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              sx={neonButtonStyle}
              onClick={handleOpen} // Open modal to add a new item
            >
              Add New Item
            </Button>
          </Box>
        </Box>
        <Stack width="100%" height="300px" spacing={2} overflow={'auto'}>
          {/* Render inventory items */}
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#1a1a1a'}
              paddingX={5}
              border={'1px solid #00f9ff'}
              borderRadius={4}
              boxShadow={'0 0 10px rgba(0, 249, 255, 0.5)'}
            >
              <Typography variant={'h3'} color={'#00f9ff'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#00f9ff'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: '#00f9ff', color: '#000', '&:hover': { bgcolor: '#00bcd4' } }}
                onClick={() => removeItem(name)} // Remove item from inventory
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Copyright text */}
      <Typography
        variant="body2"
        sx={{
          marginTop: 4,
          color: '#00f9ff',
          textAlign: 'center',
        }}
      >
        © ABDULLA MARUF
      </Typography>
    </Box>
  )
}

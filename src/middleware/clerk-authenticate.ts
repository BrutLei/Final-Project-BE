import { clerkClient } from '@clerk/clerk-sdk-node'
import { NextFunction, Request, Response } from 'express'

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const res = await clerkClient.clients.verifyClient(token)
    if (res) {
      next()
    }
  } catch (error) {
    console.log('[verifyUser][Error]')
    return res.status(401).json({ message: 'Unauthorized clerk' })
  }
}

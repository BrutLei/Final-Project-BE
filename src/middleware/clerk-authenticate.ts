import { clerkClient } from '@clerk/clerk-sdk-node'
import { NextFunction, Request, Response } from 'express'

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized clerk' })
    }
    const user = await clerkClient.verifyToken(token)
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized clerk' })
    }
    return next()
  } catch (error) {
    console.log('[ERROR] clerk-authenticate.ts: ', error)
    return res.status(401).json({ message: 'Unauthorized clerk' })
  }
}

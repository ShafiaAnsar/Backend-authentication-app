import express from 'express';

import { deleteUserById, getUsers, getUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    // Attempt to delete the user by their ID
    const deletedUser = await deleteUserById(id);

    // Check if the user was not found and handle it appropriately
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send a success response with the deleted user data
    return res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error(error);

    // Send an error response with a meaningful error message
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);
    
    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
import { validationResult } from 'express-validator';
import supabase from '../utils/supabase.js';

// Create a new room
export const createRoom = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      inspection_id, 
      name, 
      type, 
      condition, 
      items, 
      notes, 
      photos 
    } = req.body;

    // Check if inspection exists and belongs to user
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', inspection_id)
      .eq('user_id', req.user.id)
      .single();

    if (inspectionError || !inspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found or not authorized'
      });
    }

    // Create room record
    const { data: room, error } = await supabase
      .from('rooms')
      .insert({
        inspection_id,
        name,
        type,
        condition,
        items,
        notes,
        photos
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// Get all rooms for a specific inspection
export const getRoomsByInspection = async (req, res, next) => {
  try {
    const { inspectionId } = req.params;

    // Check if inspection exists and belongs to user
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', inspectionId)
      .eq('user_id', req.user.id)
      .single();

    if (inspectionError || !inspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found or not authorized'
      });
    }

    // Get rooms for the inspection
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('inspection_id', inspectionId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

// Get a single room by ID
export const getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get the room
    const { data: room, error } = await supabase
      .from('rooms')
      .select('*, inspections!inner(*)')
      .eq('id', id)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (error || !room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// Update a room
export const updateRoom = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { 
      inspection_id, 
      name, 
      type, 
      condition, 
      items, 
      notes, 
      photos 
    } = req.body;

    // Check if room exists and belongs to user's inspection
    const { data: existingRoom, error: roomError } = await supabase
      .from('rooms')
      .select('*, inspections!inner(*)')
      .eq('id', id)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (roomError || !existingRoom) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or not authorized'
      });
    }

    // Update room
    const { data: updatedRoom, error } = await supabase
      .from('rooms')
      .update({
        name,
        type,
        condition,
        items,
        notes,
        photos,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: updatedRoom
    });
  } catch (error) {
    next(error);
  }
};

// Delete a room
export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if room exists and belongs to user's inspection
    const { data: existingRoom, error: roomError } = await supabase
      .from('rooms')
      .select('*, inspections!inner(*)')
      .eq('id', id)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (roomError || !existingRoom) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or not authorized'
      });
    }

    // Delete the room
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

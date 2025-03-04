import { validationResult } from 'express-validator';
import supabase from '../utils/supabase.js';

// Create a new external area
export const createExternalArea = async (req, res, next) => {
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

    // Create external area record
    const { data: externalArea, error } = await supabase
      .from('external_areas')
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
      message: 'External area created successfully',
      data: externalArea
    });
  } catch (error) {
    next(error);
  }
};

// Get all external areas for a specific inspection
export const getExternalAreasByInspection = async (req, res, next) => {
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

    // Get external areas for the inspection
    const { data: externalAreas, error } = await supabase
      .from('external_areas')
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
      count: externalAreas.length,
      data: externalAreas
    });
  } catch (error) {
    next(error);
  }
};

// Get a single external area by ID
export const getExternalAreaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get the external area
    const { data: externalArea, error } = await supabase
      .from('external_areas')
      .select('*, inspections!inner(*)')
      .eq('id', id)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (error || !externalArea) {
      return res.status(404).json({
        success: false,
        message: 'External area not found or not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: externalArea
    });
  } catch (error) {
    next(error);
  }
};

// Update an external area
export const updateExternalArea = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { 
      name, 
      type, 
      condition, 
      items, 
      notes, 
      photos 
    } = req.body;

    // Check if external area exists and belongs to user's inspection
    const { data: existingArea, error: areaError } = await supabase
      .from('external_areas')
      .select('*, inspections!inner(*)')
      .eq('id', id)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (areaError || !existingArea) {
      return res.status(404).json({
        success: false,
        message: 'External area not found or not authorized'
      });
    }

    // Update external area
    const { data: updatedArea, error } = await supabase
      .from('external_areas')
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
      message: 'External area updated successfully',
      data: updatedArea
    });
  } catch (error) {
    next(error);
  }
};

// Delete an external area
export const deleteExternalArea = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if external area exists and belongs to user's inspection
    const { data: existingArea, error: areaError } = await supabase
      .from('external_areas')
      .select('*, inspections!inner(*)')
      .eq('id', id)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (areaError || !existingArea) {
      return res.status(404).json({
        success: false,
        message: 'External area not found or not authorized'
      });
    }

    // Delete the external area
    const { error } = await supabase
      .from('external_areas')
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
      message: 'External area deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

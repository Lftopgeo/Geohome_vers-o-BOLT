import { validationResult } from 'express-validator';
import supabase from '../utils/supabase.js';
import axios from 'axios';

// Create a new inspection
export const createInspection = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      property_data,
      structural_conditions,
      installations,
      inspector_data,
      template_id,
      notes
    } = req.body;

    // Create inspection record
    const { data: inspection, error } = await supabase
      .from('inspections')
      .insert({
        property_data,
        structural_conditions,
        installations,
        inspector_data,
        template_id,
        notes,
        user_id: req.user.id,
        status: 'draft'
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
      message: 'Inspection created successfully',
      data: inspection
    });
  } catch (error) {
    next(error);
  }
};

// Get all inspections for the current user
export const getAllInspections = async (req, res, next) => {
  try {
    const { data: inspections, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections
    });
  } catch (error) {
    next(error);
  }
};

// Get a single inspection by ID
export const getInspectionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: inspection, error } = await supabase
      .from('inspections')
      .select(`
        *,
        rooms(*),
        external_areas(*),
        keys_and_meters(*)
      `)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found'
      });
    }

    res.status(200).json({
      success: true,
      data: inspection
    });
  } catch (error) {
    next(error);
  }
};

// Update an inspection
export const updateInspection = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      property_data,
      structural_conditions,
      installations,
      inspector_data,
      template_id,
      notes,
      status
    } = req.body;

    // Check if inspection exists and belongs to user
    const { data: existingInspection, error: fetchError } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !existingInspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found'
      });
    }

    // Update inspection
    const { data: updatedInspection, error } = await supabase
      .from('inspections')
      .update({
        property_data,
        structural_conditions,
        installations,
        inspector_data,
        template_id,
        notes,
        status: status || existingInspection.status,
        updated_at: new Date()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
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
      message: 'Inspection updated successfully',
      data: updatedInspection
    });
  } catch (error) {
    next(error);
  }
};

// Delete an inspection
export const deleteInspection = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if inspection exists and belongs to user
    const { data: existingInspection, error: fetchError } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !existingInspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found'
      });
    }

    // Delete related records first (cascade delete not always reliable)
    await Promise.all([
      supabase.from('rooms').delete().eq('inspection_id', id),
      supabase.from('external_areas').delete().eq('inspection_id', id),
      supabase.from('keys_and_meters').delete().eq('inspection_id', id)
    ]);

    // Delete the inspection
    const { error } = await supabase
      .from('inspections')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inspection deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Generate PDF report for an inspection
export const generateReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get the inspection with all related data
    const { data: inspection, error } = await supabase
      .from('inspections')
      .select(`
        *,
        rooms(*),
        external_areas(*),
        keys_and_meters(*)
      `)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !inspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspection not found'
      });
    }

    try {
      // Try to use the Python ReportLab service first
      const response = await axios.post('http://localhost:8000/generate-pdf', {
        inspection: inspection
      }, {
        responseType: 'arraybuffer'
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="inspection_${id}.pdf"`);
      
      // Send the PDF
      return res.send(Buffer.from(response.data));
    } catch (pythonError) {
      console.error('Python ReportLab service error:', pythonError);
      
      // If Python service fails, return error and let frontend use jsPDF fallback
      return res.status(500).json({
        success: false,
        message: 'Error generating PDF with ReportLab service. Use frontend fallback.',
        data: inspection
      });
    }
  } catch (error) {
    next(error);
  }
};

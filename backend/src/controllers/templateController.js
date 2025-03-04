import { validationResult } from 'express-validator';
import supabase from '../utils/supabase.js';

// Create a new template
export const createTemplate = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, sections } = req.body;

    // Create template record
    const { data: template, error } = await supabase
      .from('inspection_templates')
      .insert({
        name,
        description,
        sections,
        user_id: req.user.id
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
      message: 'Template created successfully',
      data: template
    });
  } catch (error) {
    next(error);
  }
};

// Get all templates for the current user
export const getAllTemplates = async (req, res, next) => {
  try {
    const { data: templates, error } = await supabase
      .from('inspection_templates')
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
      count: templates.length,
      data: templates
    });
  } catch (error) {
    next(error);
  }
};

// Get a single template by ID
export const getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: template, error } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
};

// Update a template
export const updateTemplate = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, sections } = req.body;

    // Check if template exists and belongs to user
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !existingTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Update template
    const { data: updatedTemplate, error } = await supabase
      .from('inspection_templates')
      .update({
        name,
        description,
        sections,
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
      message: 'Template updated successfully',
      data: updatedTemplate
    });
  } catch (error) {
    next(error);
  }
};

// Delete a template
export const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if template exists and belongs to user
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !existingTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Delete the template
    const { error } = await supabase
      .from('inspection_templates')
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
      message: 'Template deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

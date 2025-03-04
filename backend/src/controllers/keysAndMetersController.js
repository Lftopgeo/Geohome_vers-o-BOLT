import { validationResult } from 'express-validator';
import supabase from '../utils/supabase.js';

// Obter todos os dados de chaves e medidores para uma inspeção
export const getKeysAndMeters = async (req, res, next) => {
  try {
    const { inspectionId } = req.params;

    // Verificar se a inspeção existe e pertence ao usuário
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', inspectionId)
      .eq('user_id', req.user.id)
      .single();

    if (inspectionError || !inspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspeção não encontrada'
      });
    }

    // Obter dados de chaves
    const { data: keys, error: keysError } = await supabase
      .from('keys')
      .select('*')
      .eq('inspection_id', inspectionId)
      .order('created_at', { ascending: true });

    if (keysError) {
      return res.status(400).json({
        success: false,
        message: keysError.message
      });
    }

    // Obter dados de medidores
    const { data: meters, error: metersError } = await supabase
      .from('meters')
      .select('*')
      .eq('inspection_id', inspectionId)
      .order('meter_type', { ascending: true });

    if (metersError) {
      return res.status(400).json({
        success: false,
        message: metersError.message
      });
    }

    // Obter dados de checklist
    const { data: checklist, error: checklistError } = await supabase
      .from('keys_meters_checklist')
      .select('*')
      .eq('inspection_id', inspectionId)
      .order('checklist_type', { ascending: true })
      .order('created_at', { ascending: true });

    if (checklistError) {
      return res.status(400).json({
        success: false,
        message: checklistError.message
      });
    }

    // Organizar o checklist por tipo
    const keysChecklist = checklist.filter(item => item.checklist_type === 'keys');
    const metersChecklist = checklist.filter(item => item.checklist_type === 'meters');

    res.status(200).json({
      success: true,
      data: {
        keys,
        meters,
        checklist: {
          keys: keysChecklist,
          meters: metersChecklist
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Salvar dados de checklist
export const saveChecklist = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { inspectionId } = req.params;
    const { checklist } = req.body;

    // Verificar se a inspeção existe e pertence ao usuário
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', inspectionId)
      .eq('user_id', req.user.id)
      .single();

    if (inspectionError || !inspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspeção não encontrada'
      });
    }

    // Para cada tipo de checklist, vamos verificar se já existe e atualizar ou criar novo
    const promises = [];

    // Processar checklists de chaves
    if (checklist.keys && Array.isArray(checklist.keys)) {
      for (const item of checklist.keys) {
        if (item.id) {
          // Atualizar item existente
          promises.push(
            supabase
              .from('keys_meters_checklist')
              .update({
                is_checked: item.isChecked,
                observations: item.observations,
                updated_at: new Date()
              })
              .eq('id', item.id)
              .eq('inspection_id', inspectionId)
          );
        } else {
          // Criar novo item
          promises.push(
            supabase
              .from('keys_meters_checklist')
              .insert({
                inspection_id: inspectionId,
                checklist_type: 'keys',
                item_label: item.label,
                is_checked: item.isChecked,
                observations: item.observations
              })
          );
        }
      }
    }

    // Processar checklists de medidores
    if (checklist.meters && Array.isArray(checklist.meters)) {
      for (const item of checklist.meters) {
        if (item.id) {
          // Atualizar item existente
          promises.push(
            supabase
              .from('keys_meters_checklist')
              .update({
                is_checked: item.isChecked,
                observations: item.observations,
                updated_at: new Date()
              })
              .eq('id', item.id)
              .eq('inspection_id', inspectionId)
          );
        } else {
          // Criar novo item
          promises.push(
            supabase
              .from('keys_meters_checklist')
              .insert({
                inspection_id: inspectionId,
                checklist_type: 'meters',
                item_label: item.label,
                is_checked: item.isChecked,
                observations: item.observations
              })
          );
        }
      }
    }

    // Executar todas as operações
    const results = await Promise.all(promises);
    
    // Verificar se houve erros
    const errors = results.filter(result => result.error).map(result => result.error);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao salvar alguns itens do checklist',
        errors
      });
    }

    // Atualizar o status da inspeção
    await supabase
      .from('inspections')
      .update({
        updated_at: new Date(),
        status: 'in_progress'
      })
      .eq('id', inspectionId)
      .eq('user_id', req.user.id);

    res.status(200).json({
      success: true,
      message: 'Checklist salvo com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// Adicionar uma nova chave
export const addKey = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { inspectionId } = req.params;
    const { 
      room_name, 
      key_count, 
      clearly_identified, 
      condition, 
      tested, 
      photos, 
      observations 
    } = req.body;

    // Verificar se a inspeção existe e pertence ao usuário
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', inspectionId)
      .eq('user_id', req.user.id)
      .single();

    if (inspectionError || !inspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspeção não encontrada'
      });
    }

    // Adicionar nova chave
    const { data: key, error } = await supabase
      .from('keys')
      .insert({
        inspection_id: inspectionId,
        room_name,
        key_count,
        clearly_identified,
        condition,
        tested,
        photos: photos || [],
        observations
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
      message: 'Chave adicionada com sucesso',
      data: key
    });
  } catch (error) {
    next(error);
  }
};

// Adicionar um novo medidor
export const addMeter = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { inspectionId } = req.params;
    const { 
      meter_type, 
      meter_number, 
      current_reading, 
      condition, 
      seal_intact, 
      photos, 
      observations,
      leaks,
      meter_display_type,
      breakers_working,
      leak_test_done,
      safety_valve_working
    } = req.body;

    // Verificar se a inspeção existe e pertence ao usuário
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', inspectionId)
      .eq('user_id', req.user.id)
      .single();

    if (inspectionError || !inspection) {
      return res.status(404).json({
        success: false,
        message: 'Inspeção não encontrada'
      });
    }

    // Adicionar novo medidor
    const { data: meter, error } = await supabase
      .from('meters')
      .insert({
        inspection_id: inspectionId,
        meter_type,
        meter_number,
        current_reading,
        condition,
        seal_intact,
        photos: photos || [],
        observations,
        leaks,
        meter_display_type,
        breakers_working,
        leak_test_done,
        safety_valve_working
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
      message: 'Medidor adicionado com sucesso',
      data: meter
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar uma chave existente
export const updateKey = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { keyId } = req.params;
    const { 
      room_name, 
      key_count, 
      clearly_identified, 
      condition, 
      tested, 
      photos, 
      observations 
    } = req.body;

    // Verificar se a chave existe e pertence ao usuário
    const { data: existingKey, error: fetchError } = await supabase
      .from('keys')
      .select('*, inspections!inner(*)')
      .eq('id', keyId)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (fetchError || !existingKey) {
      return res.status(404).json({
        success: false,
        message: 'Chave não encontrada'
      });
    }

    // Atualizar chave
    const { data: key, error } = await supabase
      .from('keys')
      .update({
        room_name,
        key_count,
        clearly_identified,
        condition,
        tested,
        photos: photos || existingKey.photos,
        observations,
        updated_at: new Date()
      })
      .eq('id', keyId)
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
      message: 'Chave atualizada com sucesso',
      data: key
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar um medidor existente
export const updateMeter = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { meterId } = req.params;
    const { 
      meter_type, 
      meter_number, 
      current_reading, 
      condition, 
      seal_intact, 
      photos, 
      observations,
      leaks,
      meter_display_type,
      breakers_working,
      leak_test_done,
      safety_valve_working
    } = req.body;

    // Verificar se o medidor existe e pertence ao usuário
    const { data: existingMeter, error: fetchError } = await supabase
      .from('meters')
      .select('*, inspections!inner(*)')
      .eq('id', meterId)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (fetchError || !existingMeter) {
      return res.status(404).json({
        success: false,
        message: 'Medidor não encontrado'
      });
    }

    // Atualizar medidor
    const { data: meter, error } = await supabase
      .from('meters')
      .update({
        meter_type,
        meter_number,
        current_reading,
        condition,
        seal_intact,
        photos: photos || existingMeter.photos,
        observations,
        leaks,
        meter_display_type,
        breakers_working,
        leak_test_done,
        safety_valve_working,
        updated_at: new Date()
      })
      .eq('id', meterId)
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
      message: 'Medidor atualizado com sucesso',
      data: meter
    });
  } catch (error) {
    next(error);
  }
};

// Excluir uma chave
export const deleteKey = async (req, res, next) => {
  try {
    const { keyId } = req.params;

    // Verificar se a chave existe e pertence ao usuário
    const { data: existingKey, error: fetchError } = await supabase
      .from('keys')
      .select('*, inspections!inner(*)')
      .eq('id', keyId)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (fetchError || !existingKey) {
      return res.status(404).json({
        success: false,
        message: 'Chave não encontrada'
      });
    }

    // Excluir chave
    const { error } = await supabase
      .from('keys')
      .delete()
      .eq('id', keyId);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chave excluída com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// Excluir um medidor
export const deleteMeter = async (req, res, next) => {
  try {
    const { meterId } = req.params;

    // Verificar se o medidor existe e pertence ao usuário
    const { data: existingMeter, error: fetchError } = await supabase
      .from('meters')
      .select('*, inspections!inner(*)')
      .eq('id', meterId)
      .eq('inspections.user_id', req.user.id)
      .single();

    if (fetchError || !existingMeter) {
      return res.status(404).json({
        success: false,
        message: 'Medidor não encontrado'
      });
    }

    // Excluir medidor
    const { error } = await supabase
      .from('meters')
      .delete()
      .eq('id', meterId);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medidor excluído com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

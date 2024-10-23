//Author: YuFu
const eventsModel = require('../models/eventModel');

// 取得所有活動
const getAllEvents = async (req, res) => {
    try {
        const events = await eventsModel.getAllEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message + "this" });
    }
}

// 取得單個活動
const getEventsById = async (req, res) => {
    try {
        const events = await eventsModel.getEvents(req.params.id);
        if (!events) {
            return res.status(404).json({ message: 'Events not found' });
        }
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 新增活動
const createEvents = async (req, res) => {
    try {

        const newEvents = await eventsModel.createEvents(req.body);
        res.status(201).json(newEvents);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// 更新活動
const updateEvents = async (req, res) => {
    try {
        const updatedEvent = await eventsModel.updateEvents(req.params.id, req.body);
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Events not found' });
        }
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// 刪除活動
const deleteEvents = async (req, res) => {
    try {
        const deletedEvent = await eventsModel.deleteEvents(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Events not found' });
        }
        res.json({ message: 'Events deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getAllEvents,
    getEventsById,
    createEvents,
    updateEvents,
    deleteEvents,
};

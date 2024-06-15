import Listing from "../models/listing.model.js"

export const createListing = async (req,res,next) =>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req,res,next)=>{
    try {
        const listing = await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

export const updateListing = async (req,res,next)=>{
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body ,{new: true});
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error)
    }
}

export const getlisting = async (req,res,next) =>{
    try {
        const listing = await Listing.findById(req.params.id);
        res.status(200).json(listing);
    } catch (error) {
        next(error)
    }
}
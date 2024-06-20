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

export const searchListings = async (req,res,next)=>{
    try {
        const limit = parseInt(req.query.limit) || 4;
        const startIndex = parseInt(req.query.startIndex) || 0;
        
        let offer = req.query.offer;
        if(offer === undefined || offer === 'false'){
            offer = {$in: [false,true]};
        }
        
        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === 'false'){
            furnished = {$in: [false,true]};
        }
        
        let parking = req.query.parking;
        if(parking === undefined || parking === 'false'){
            parking = {$in: [false,true]};
        }
        
        let type = req.query.type;
        if(type === undefined || type === 'all'){
            type = {$in: ['rent','sale']};
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';
        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type
        }).sort({ [sort] : order })
        .limit(limit).skip(startIndex);

        return res.status(200).json(listings);

    } catch (error) {
        next(error)
    }
}
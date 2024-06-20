import React, { useEffect, useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase'
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
    
    const {currentUser, userError , uerLoading} = useSelector((state) => state.user);
    const [files,setFiles] = useState([]);
    const [formData , setFormData] = useState({
        imageUrls: [],
        name:'',
        description:'',
        address:'',
        type:'remt',
        bedrooms:1,
        bathrooms:1,
        regularPrice:0,
        discountedPrice:0,
        offer:false,
        parking:false,
        furnished:false
    });
    const [imageUploadError , setImageUploadError] = useState(false)
    const [imageUpload , setImageUpload] = useState(false)
    const [loading , setLoading] = useState(false)
    const [error,setError] = useState(false)
    const navigate = useNavigate();
    const params = useParams();

    
    useEffect(()=>{
        const fetchListing = async () => {
          const listingId = params.listingId;
          try {
            const listing = await fetch(`/api/listing/get/${listingId}`,{
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.accessToken}`
              }  
            })
            const data = await listing.json();
            setFormData(data);
          } catch (error) {
            setError(error)
          }
        }

        fetchListing();
      },[])

    const handleImageSubmit = (e)=>{
        if(files.length > 0 && (files.length + formData.imageUrls.length)<7){
            setImageUpload(true)
            setImageUploadError(false)

            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storImage(files[i]));
            }
            Promise.all(promises)
            .then((urls)=>{
                setFormData({...formData,imageUrls: formData.imageUrls.concat(urls)});
                setImageUploadError(false);
                setImageUpload(false);
            })
            .catch((error)=>{
                setImageUploadError("Image upload failed (2mb max per image)");
                setImageUpload(false);
            })
        }
        else {
            setImageUploadError("Maximum 6 images allowed");
            setImageUpload(false)
        }
    }//to upload image

    const storImage = async (file)=>{
        return new Promise((resolve, reject)=>{
            const storage = getStorage(app);
            const filename = new Date().getTime() + file.name;
            const storageRef = ref(storage,filename);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            ) 
        })
    }//to store image in firebase

    const handleRemoveImage = (index) =>{
        setFormData({...formData,imageUrls: formData.imageUrls.filter((_,i)=>i!==index)})
    }// to delete image from listing

    const handleTypeChange = (t)=>{
        setFormData({...formData,type:t});
    }//to setvalue of sell and rent checkboxes

    const handleInputChange = (e)=>{
        if(e.target.type === 'text'||e.target.type === 'textarea'||e.target.type === 'number'){
            setFormData({...formData,[e.target.id]:e.target.value})
        }
        else if(e.target.type === 'checkbox'){
            setFormData({...formData,[e.target.id]:e.target.checked})
        }
    }//to set value of input to formData

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            setError(false);
            if(formData.imageUrls.length < 1) return setError("You must upload atleast 1 image")
            if(formData.regularPrice < formData.discountedPrice) return setError("Discount price must be less than regular price")
            setLoading(true);
            const res = await fetch(`/api/listing/update/${params.listingId }`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id 
                })
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }//POST request to save formData to backend


    return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-3 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={"62"}
            minLength={"10"}
            required
            onChange={(e)=>handleInputChange(e)}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={(e)=>handleInputChange(e)}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={(e)=>handleInputChange(e)}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" onChange={()=>handleTypeChange('sale')} checked={formData.type === 'sale'}/>
              <span className="">Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={()=>handleTypeChange('rent')} checked={formData.type === 'rent'}/>
              <span className="">Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" onChange={(e)=>handleInputChange(e)} checked={formData.parking}/>
              <span className="">Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={(e)=>handleInputChange(e)} checked={formData.furnished}/>
              <span className="">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={(e)=>handleInputChange(e)} checked={formData.offer}/>
              <span className="">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={"1"}
                max={"10"}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={(e)=>handleInputChange(e)}
                value={formData.bedrooms}
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={"1"}
                max={"10"}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={(e)=>handleInputChange(e)}
                value={formData.bathrooms}
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={"1"}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={(e)=>handleInputChange(e)}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">(₨ / month)</span>
              </div>
            </div>
            {formData.offer && <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                min={"1"}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={(e)=>handleInputChange(e)}
                value={formData.discountedPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">(₨ / month)</span>
              </div>
            </div>}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">Images:</p>
          <span className="font-normal text-gray-600 ml-2 ">
            The first image will be the cover (max 6)
          </span>
          <div className="flex gap-4">
            <input
                onChange={(e)=>setFiles(e.target.files)}
              type="file"
              id="images"
              accept="images/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button disabled={imageUpload} onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              {imageUpload ? "Uploading...":"Upload"}
            </button>
          </div>
            <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>(
                    <div key={url} className="flex justify-between p-3 border border-gray-300 items-center">
                        <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg"/>
                        <button type="button" onClick={()=>handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                    </div>
                ))
            }
          <button disabled={loading || imageUpload} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Updating..." : "Update"}
          </button>
          {error ? <p className="text-red-700">{error}</p> : null}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;

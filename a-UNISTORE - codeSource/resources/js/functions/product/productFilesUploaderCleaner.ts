import { ModelType } from "@/types/backendTypes";
import { FlagMedia } from "@/types/mediaTypes";
import axios from "axios";
import { route } from "ziggy-js";

export  const productFilesUploaderCleaner = () => {

      const uploadProductFiles = async (file: File, collection: FlagMedia  , model_type : ModelType  , toDraftId? : string) => {
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('collection', collection);
          formData.append('model_type', model_type);
          formData.append('model_id', toDraftId ?? '');
          
          try 
          {  
            const response = await axios.post(route('media.store'), formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              }, }
            );
            return response.data;

          }catch (error : any) {
              throw new Error(extractUploadError(error));
          }
        };


      const deleteMedia = async (mediaId : string) => {
          try {
            const r =  await axios.delete(route('media.destroy' , mediaId))
          }catch(error){
              throw new Error("Failed to remove the image. Please try again.") ;
          }
      }


      const cleanProductTempMediaOnDistroy = async (draftId : string) => {
        try { 
          await axios.delete(route('media.destroy.bulk') , {
                      data : {
                          draft_id : draftId , 
                      }
                  } )
          }catch(error){
              throw new Error("Failed to remove the temp files. Please try again.") ;
          }
      }
        
      function extractUploadError(err: any): string {
        // Backend validation message
        if (err?.response?.data?.errors?.file) {
          return err.response.data.errors.file[0];
        }

        // Backend general message
        if (err?.response?.data?.message) {
          return err.response.data.message;
        }

        // File too large (HTTP 413)
        if (err?.response?.status === 413) {
          return "File is too large.";
        }

        // Network / unknown
        return "Upload failed. Please try again.";
      }


 return { cleanProductTempMediaOnDistroy , uploadProductFiles , deleteMedia}
 
}


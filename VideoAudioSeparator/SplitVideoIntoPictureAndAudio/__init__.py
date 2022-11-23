import tempfile
import os
import moviepy.editor as mp
import azure.functions as func
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import logging
RAW_VIDEOS_CONTAINER_NAME = "rawvideos"
AUDIOS_CONTAINER_NAME = "audio"
AUDIO_EXTENSION = ".mp3"


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Create the BlobServiceClient object
    blob_service_client: BlobServiceClient = BlobServiceClient.from_connection_string(
        os.environ["AzureWebJobsStorage"])

    raw_videos_container_client: ContainerClient = blob_service_client.get_container_client(
        container=RAW_VIDEOS_CONTAINER_NAME)
    blobName = req.params.get('blobName')

    if not blobName:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            blobName = req_body.get('blobName')

    if not blobName:
        return func.HttpRequest("Must include a correct mp4 video blob in the query string", status_code=400)

    with tempfile.NamedTemporaryFile(suffix=".mp4") as download_file_path:
        logging.info("\nDownloading blob to \n\t" + download_file_path.name)
        download_file_path.write(
            raw_videos_container_client.download_blob(blobName).readall())
        raw_clip = mp.VideoFileClip(download_file_path.name)

        # Extract audio and upload to blob storage
        with tempfile.NamedTemporaryFile(suffix=AUDIO_EXTENSION) as clip_audio:
            raw_clip.audio.write_audiofile(clip_audio.name)
            audio_blob_name = getBlobFileName(blobName)+AUDIO_EXTENSION

            logging.info(
                "\nUploading to Azure Storage as blob:\n\t" + audio_blob_name)

            audio_blob_client: BlobClient = blob_service_client.get_blob_client(
                container=AUDIOS_CONTAINER_NAME, blob=audio_blob_name)
            audio_blob_client.upload_blob(clip_audio)

        # Reduce quality by factor of

    if blobName:
        return func.HttpResponse(f"Hello, {blobName}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200
        )


def getBlobFileName(blobName: str):
    """
    Returns the part of blobName before the extension.
    Precondition
    """
    return blobName[:blobName.index(".")]

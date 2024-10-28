import streamlit as st
from io import StringIO

st.write("# Chunkster")
st.write("### Visualise chunks from your files")

uploaded_files = st.file_uploader("Upload a file", type=["txt", "pdf", "md"], accept_multiple_files=True)

if uploaded_files is not None:
        # stringio = []
        for file in uploaded_files:
                bytes_data = file.read()
                st.write("filename:", file.name, "filetype:", file.type)
                # st.write(bytes_data)
                if file.type =="text/plain":
                    stringio = StringIO(bytes_data.decode("utf-8"))
                    st.write(stringio)
                # if file.type =="application/pdf"
        # bytes_data =  uploaded_files.getvalue() #streamlit uploaded files have byte-like structure, so can be used in this form
        # st.write(bytes_data)
        # stringio = StringIO(uploaded_files.getvalue().decode("utf-8")) #or can be converted to diffrent formats - here a string
        # st.write(stringio)
        # string_data = stringio.read() ## To read file as string, not sure how it's different from the last above one
        # st.write(string_data)

        
        
        
    #     file_details = {"file_name" : uploaded_file.name,
    #                 "file_type" : uploaded_file.type,
    #                 "file_size" : uploaded_file.size}
    # st.write("File details:", file_details)



# elif: st.write("Upload a file to see your chunks.")



# chunking_method = st.slider()

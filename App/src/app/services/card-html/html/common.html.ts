export const COMMON_CSS = `
    body {
        margin: 0;
        max-width: 100vw;
        overflow-x: hidden;
    }
      
    body::-webkit-scrollbar {
        width: 12px;               /* width of the entire scrollbar */
      }
    
      body::-webkit-scrollbar-track {
        background: #303030;        /* color of the tracking area */
    }
    
    body::-webkit-scrollbar-thumb {
    background-color: #8b8a8a;    /* color of the scroll thumb */
    border-radius: 20px;       /* roundness of the scroll thumb */
    border: 3px solid #303030;  /* creates padding around scroll thumb */
    }

    .main-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        min-height: calc(50vh - 40px);
        padding: 20px;
    }

    .answer-container {
        min-height: calc(50vh - 40px);
        padding: 20px;
    }

    .hover-icon {
        color: white;
        opacity: 0.7;
    }
    .hover-icon:hover {
        opacity: 1;
        cursor: pointer;
    }

    .button-size {
        transform: scale(1.6);
    }

    .input-size {
        transform: scale(5);
    }

    .my-link {
        text-decoration: underline;
    }

    .my-link:hover {
        cursor: pointer;
    }

`;
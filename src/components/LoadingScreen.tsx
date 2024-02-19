import ReactLoading from "react-loading";

const LoadingScreen = () => {
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <ReactLoading
                type="spin"
                color={"#39aaff"}
                height={50}
                width={50}
                delay={50}
            />
        </div>
    );
};

export default LoadingScreen;
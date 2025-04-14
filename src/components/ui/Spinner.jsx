import ClipLoader from "react-spinners/ClipLoader";

const override= {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
  };

const Spinner = ({loading}) => {
  return (
    <div>
    <ClipLoader
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
      />
    </div>
  )
}

export default Spinner

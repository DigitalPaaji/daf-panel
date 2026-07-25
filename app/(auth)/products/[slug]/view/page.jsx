import ViewCompo from "./ViewCompo";


const page = async({params}) => {
    const {slug} = await params;

  return (
    <div>


<ViewCompo slug={slug} />

    </div>
  )
}

export default page
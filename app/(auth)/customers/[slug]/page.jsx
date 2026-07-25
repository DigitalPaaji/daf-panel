import UserCompo from "./UserCompo";


const page = async ({params}) => {
    const {slug} = await params;
  

  return (
    <div>
<UserCompo slug={slug} />

    </div>
  )
}

export default page

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";

export const getStaticProps = async () => {
    const res = await fetch('http://localhost:3000/api/escalas/index.js')
    const escalas = await res.json()
    return { props: { repo } }
}

async function getEscalas() {
    const res = await fetch('http://localhost:3001/api/escalas')
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // Recommendation: handle errors
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

export default async function Escalas({ escalas }) {
    const data = await getEscalas()

    return (
            <DashboardLayout>
                <DashboardNavbar />
                     {data.id}

            </DashboardLayout>

        )


}
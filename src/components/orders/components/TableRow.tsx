import { getOrgData } from "@/lib/createCookie"
import { getOrderImages, getOrdersByBusinessId, marckSettled } from "@/services/api/apiOrder"
import { updatePaymentStatus } from "@/services/api/apiOrder"
import { OrderData } from "@/types/Orders"
import { AlertTriangleIcon, BadgeCheckIcon, CheckCircleIcon, ClockIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { OrderDetailsDialog } from "./OrderDetailsDialog "


const ImageComp = ({ data }: { data: string }) => {
    const [loading, setLoading] = useState(true)
    const [image, setImage] = useState<string[] | null>(null)

    const getOrderImage = () => {
        setLoading(true)
        getOrderImages(data)
            .then((response) => {
                // console.log(response)
                setImage(response)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getOrderImage()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className=' w-full justify-center flex  dark:border-gray-200 rounded-md p-1'>
            {
                loading ?
                    <div className='text-gray-500 dark:text-gray-400'>Loading images...</div>
                    :
                    <>
                        {
                            image?.map((img, index) => (
                                <Image
                                    key={index}
                                    src={img}
                                    width={100}
                                    height={100}
                                    alt={`Order Image ${index + 1}`}
                                // className='max-w-40 grow object-cover rounded-md'
                                />
                            ))
                        }
                    </>
            }
        </div>
    )
}


export const TableRow = ({ e, setOrderData }: { e: OrderData, setOrderData: (data: any) => void }) => {
    const [option, setOption] = useState<OrderData | null>(null)
    const [show, setShow] = useState(false)
    const [loding, setLoding] = useState(false)
    const [loading, setLoading] = useState(false)
    const businessData = getOrgData() // Assuming this function returns the business data

    const HundelSetteld = (data: string) => {
        setLoading(true)
        // console.log(data)
        marckSettled(data)
            .then((res) => {
                // console.log("res:", res)
                getOrdersByBusinessId(businessData?.id)
                    .then((response) => {
                        setOrderData(response)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    const InfoBlock = ({ label, value }: { label: string; value?: string | number }) => (
        <div>
            <div className="text-sm font-bold">{label}</div>
            <div>{value || "—"}</div>
        </div>
    );

    const updateOrderPaymentStatus = (paymentId: string, token: string) => {
        // console.log("Updating payment status for:", paymentId, token)
        setLoding(true)
        updatePaymentStatus(paymentId, token)
            .then((res) => {
                console.log("Payment status updated successfully:", res);
                getOrdersByBusinessId(businessData?.id) // Refresh the order data after updating payment status
                    .then((res) => {
                        // console.log(res)
                        setOrderData(res)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.error("Error updating payment status:", error);
            })
            .finally(() => {
                setLoding(false)
            })
    }

    return (
        <>
            <OrderDetailsDialog
                isOpen={show}
                onClose={() => setShow(false)}
                order={e}
                onMarkSettled={HundelSetteld}
                onCheckPaymentStatus={updateOrderPaymentStatus}
                loading={false}
                paymentCheckLoading={false}
            />
            <tr
                key={e.id}
                onClick={() => {
                    setShow(true)
                    console.log("order: ", e)
                }}
                className=''
            >

                <td className='flex justify-center'>
                    <div className={`py-1 px-3 rounded-md text-center flex items-center gap-2 ${e.order_status === 'pending' ? 'bg-[#1A0670] text-white' : 'text-[#1A0670] dark:text-white'}`}>
                        {e.order_status === 'pending' && <ClockIcon className='size-4' />}
                        {e.order_status === 'complete' && <CheckCircleIcon className='size-4' />}
                        {e.order_status.charAt(0).toUpperCase() + e.order_status.slice(1)}
                    </div>
                </td>
                <td>{new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td>{e.customers?.name}</td>
                {/* <td className=''>{e.products.name}</td> Product/Services not in structure – you can customize this if needed */}
                <td className=''>{e.order_id}</td>
                <td className=''>ZMW {e.total_amount?.toFixed(2)}</td>
                <td className="text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${e.order_payment_status !== 'pending'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {e.order_payment_status !== 'pending' ? (
                            <CheckCircleIcon className="size-4" />
                        ) : (
                            <AlertTriangleIcon className="size-4" />
                        )}
                        {e.order_payment_status === "pending" ? "Not Paid" : "Paid"}
                    </span>
                </td>
            </tr>
        </>
    )
}

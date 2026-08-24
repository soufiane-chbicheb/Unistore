import { Plus, PackageX } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

const GoCreateProduct = ({title, description} :{title : string , description : string}) => {
    return (
        <div className="flex min-h-[500px] items-center justify-center p-8">
            <div className="flex max-w-md flex-col items-center text-center space-y-6">
                {/* Icon with styling */}
                <div className="rounded-full bg-gray-100 p-6">
                    <PackageX className="h-16 w-16 text-gray-400" strokeWidth={1.5} />
                </div>
                
                {/* Text content */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {title}
                    </h1>
                    <p className="text-gray-500">
                        {description}
                    </p>
                </div>
                
                {/* CTA Button */}
                <Link href={route("products.create")}>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Product
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default GoCreateProduct;

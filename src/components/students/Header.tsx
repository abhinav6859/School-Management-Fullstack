"use client";


import FormModal from "@/components/FormModal";


interface StudentHeadersProps {
studentcount: number;
onSearch: (term: string) => void;
 showActions: boolean;
searchTerm: string;
handlesuccess: () => void;
handleerror: (error: string) => void;
role: string;
}

export default function StudentHeader({
     studentcount
, onSearch, searchTerm
, handlesuccess, handleerror,
role, showActions
     }: StudentHeadersProps) {
    return (
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Student List
                      <span className="ml-2 text-sm font-normal text-gray-500">({studentcount} students)</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage and view all student information</p>
                  </div>
        
                  <div className="flex gap-3 items-center">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                      />
                      <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
        
                    {showActions && role === "admin" && (
                      <FormModal
                        table="student"
                        type="create"
                        onSuccess={handlesuccess}
                        onError={handleerror}
                      />
                    )}
                  </div>
                </div>
               </div> 
       ); 
                
}
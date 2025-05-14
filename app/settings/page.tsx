"use client"

import { useState } from "react"
import {
  Copy,
  Eye,
  EyeOff,
  Trash,
  Search,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("credentials")
  const [showPublicClientId, setShowPublicClientId] = useState(false)
  const [showServerClientId, setShowServerClientId] = useState(false)
  const [showPublicKey, setShowPublicKey] = useState(false)
  const [showServerKey, setShowServerKey] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    // In a real app, you would show a toast notification here
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <Tabs defaultValue="credentials" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-auto">
            <TabsTrigger
              value="credentials"
              className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Credentials
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="mt-6">
            <div className="space-y-8">
              {/* Public Keys Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-xl font-semibold">Public Keys</h2>
                    <p className="text-sm text-gray-500">Use public keys to make client-side requests.</p>
                  </div>
                  <Button variant="default" className="bg-black text-white hover:bg-gray-800">
                    <span className="mr-1">+</span> New Client
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6 border-r">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Client Name</p>
                          <p className="font-medium">frontend</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">Client ID</p>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-sm">
                              {showPublicClientId
                                ? "dtect_client_1234_5678_abcd"
                                : "••••••••_••••_••••_••••_••••••••••"}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setShowPublicClientId(!showPublicClientId)}
                            >
                              {showPublicClientId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleCopy("dtect_client_1234_5678_abcd")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Button variant="destructive" className="w-full justify-center">
                          <Trash className="h-4 w-4 mr-2" /> Delete Client
                        </Button>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-sm text-gray-500 mb-4">API Keys</p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-sm">
                            {showPublicKey
                              ? "dtect_pk_5678_1234_efgh_ijkl_mnopqrstuvwxyz"
                              : "•••••••••••••••••••••••••••••••••••••���••••"}
                          </p>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setShowPublicKey(!showPublicKey)}
                            >
                              {showPublicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleCopy("dtect_pk_5678_1234_efgh_ijkl_mnopqrstuvwxyz")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full justify-center">
                          <span className="mr-1">+</span> New API Key
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Server Keys Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-xl font-semibold">Server Keys</h2>
                    <p className="text-sm text-gray-500">
                      Use server keys to make server-to-server requests to our API.
                    </p>
                  </div>
                  <Button variant="default" className="bg-black text-white hover:bg-gray-800">
                    <span className="mr-1">+</span> New Client
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6 border-r">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Client Name</p>
                          <p className="font-medium">backend</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">Client ID</p>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-sm">
                              {showServerClientId
                                ? "dtect_client_9876_5432_wxyz"
                                : "••••••••_••••_••••_••••_••••••••••"}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setShowServerClientId(!showServerClientId)}
                            >
                              {showServerClientId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleCopy("dtect_client_9876_5432_wxyz")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Button variant="destructive" className="w-full justify-center">
                          <Trash className="h-4 w-4 mr-2" /> Delete Client
                        </Button>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-sm text-gray-500 mb-4">API Keys</p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-sm">
                            {showServerKey
                              ? "dtect_sk_9876_5432_abcd_efgh_ijklmnopqrstuv"
                              : "••••••••••••••••••••••••••••••••••••••••••"}
                          </p>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setShowServerKey(!showServerKey)}
                            >
                              {showServerKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleCopy("dtect_sk_9876_5432_abcd_efgh_ijklmnopqrstuv")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full justify-center">
                          <span className="mr-1">+</span> New API Key
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Users</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="h-10 w-64 rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <Button variant="default" className="bg-black text-white hover:bg-gray-800">
                    <span className="mr-1">+</span> Add new user
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">E-mail</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Bruno Patinho</td>
                      <td className="py-3 px-4">bpatinho+dtectapi@dtect.io</td>
                      <td className="py-3 px-4">Account Owner</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          ACTIVE
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Jeremy Short</td>
                      <td className="py-3 px-4">jshort+dtectapi@dtect.io</td>
                      <td className="py-3 px-4">Admin</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          ACTIVE
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Rows per page</span>
                  <select className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">Page 1 of 1</span>
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

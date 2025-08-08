"use client"

import { useState } from "react"
import { Copy, Eye, EyeOff, Trash, Search, Pencil, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("credentials")
  const [showPublicClientId, setShowPublicClientId] = useState(false)
  const [showServerClientId, setShowServerClientId] = useState(false)
  const [showPublicKey, setShowPublicKey] = useState(false)
  const [showServerKey, setShowServerKey] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    products: {
      linkProtector: {
        enabled: false,
        role: ""
      },
      api: {
        enabled: false,
        role: ""
      }
    }
  })

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    // In a real app, you would show a toast notification here
  }

  const handleAddUser = () => {
    // In a real app, you would save the user here
    console.log("Adding user:", newUser)
    setShowAddUserModal(false)
    setNewUser({ 
      fullName: "", 
      email: "", 
      products: {
        linkProtector: {
          enabled: false,
          role: ""
        },
        api: {
          enabled: false,
          role: ""
        }
      }
    })
  }

  const handleCancelAddUser = () => {
    setShowAddUserModal(false)
    setNewUser({ 
      fullName: "", 
      email: "", 
      products: {
        linkProtector: {
          enabled: false,
          role: ""
        },
        api: {
          enabled: false,
          role: ""
        }
      }
    })
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
                              : "•••••••••••••••••••••••••••••••••••••••••"}
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
                  <Button 
                    variant="default" 
                    className="bg-black text-white hover:bg-gray-800"
                    onClick={() => setShowAddUserModal(true)}
                  >
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
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new user</DialogTitle>
            <DialogDescription>
              Manage the user's information below. Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-4">              
              <div className="grid gap-4">
                <Label className="text-base font-medium">Products</Label>
                
                <div className="grid gap-3">
                  {/* Link Protector Product Card */}
                  <div className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    newUser.products.linkProtector.enabled 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div 
                      className="flex items-start space-x-3"
                      onClick={() => setNewUser({
                        ...newUser,
                        products: {
                          ...newUser.products,
                          linkProtector: {
                            ...newUser.products.linkProtector,
                            enabled: !newUser.products.linkProtector.enabled,
                            role: !newUser.products.linkProtector.enabled ? newUser.products.linkProtector.role : ""
                          }
                        }
                      })}
                    >                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Link Protector</h3>
                            <p className="text-sm text-gray-500">Protect any link with dtect</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center mt-0.5">
                        <div className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          <input
                            type="checkbox"
                            checked={newUser.products.linkProtector.enabled}
                            onChange={() => {}}
                            className="sr-only"
                          />
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            newUser.products.linkProtector.enabled ? 'translate-x-5 bg-blue-600' : 'translate-x-0.5 bg-gray-400'
                          }`} />
                          <span className={`absolute inset-0 h-full w-full rounded-full transition-colors duration-200 ease-in-out ${
                            newUser.products.linkProtector.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`} />
                        </div>
                      </div>
                    </div>
                    
                    {newUser.products.linkProtector.enabled && (
                      <div className="mt-4 pl-8 space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Role</Label>
                        <div className="grid gap-2">
                          <div 
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              newUser.products.linkProtector.role === 'admin' 
                                ? 'border-blue-500 bg-white shadow-sm' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            onClick={() => setNewUser({
                              ...newUser,
                              products: {
                                ...newUser.products,
                                linkProtector: {
                                  ...newUser.products.linkProtector,
                                  role: 'admin'
                                }
                              }
                            })}
                          >
                            <div className="flex items-start space-x-2">
                              <input
                                type="radio"
                                name="linkProtectorRole"
                                value="admin"
                                checked={newUser.products.linkProtector.role === 'admin'}
                                onChange={() => {}}
                                className="mt-1 text-blue-600 focus:ring-blue-500"
                              />
                              <div>
                                <div className="font-medium text-gray-900">Admin</div>
                                <div className="text-xs text-gray-500">Admins can manage users and link protectors</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* API Product Card */}
                  <div className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    newUser.products.api.enabled 
                      ? 'border-green-500 bg-green-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div 
                      className="flex items-start space-x-3"
                      onClick={() => setNewUser({
                        ...newUser,
                        products: {
                          ...newUser.products,
                          api: {
                            ...newUser.products.api,
                            enabled: !newUser.products.api.enabled,
                            role: !newUser.products.api.enabled ? newUser.products.api.role : ""
                          }
                        }
                      })}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">API</h3>
                            <p className="text-sm text-gray-500">Access our powerful API endpoints</p>
                          </div>
                        </div>
                      </div>
                       <div className="flex items-center justify-center mt-0.5">
                        <div className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                          <input
                            type="checkbox"
                            checked={newUser.products.api.enabled}
                            onChange={() => {}}
                            className="sr-only"
                          />
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            newUser.products.api.enabled ? 'translate-x-5 bg-green-600' : 'translate-x-0.5 bg-gray-400'
                          }`} />
                          <span className={`absolute inset-0 h-full w-full rounded-full transition-colors duration-200 ease-in-out ${
                            newUser.products.api.enabled ? 'bg-green-600' : 'bg-gray-200'
                          }`} />
                        </div>
                      </div>
                    </div>
                    
                    {newUser.products.api.enabled && (
                      <div className="mt-4 pl-8 space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Role</Label>
                        <div className="grid gap-2">
                          <div 
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              newUser.products.api.role === 'admin' 
                                ? 'border-green-500 bg-white shadow-sm' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            onClick={() => setNewUser({
                              ...newUser,
                              products: {
                                ...newUser.products,
                                api: {
                                  ...newUser.products.api,
                                  role: 'admin'
                                }
                              }
                            })}
                          >
                            <div className="flex items-start space-x-2">
                              <input
                                type="radio"
                                name="apiRole"
                                value="admin"
                                checked={newUser.products.api.role === 'admin'}
                                onChange={() => {}}
                                className="mt-1 text-green-600 focus:ring-green-500"
                              />
                              <div>
                                <div className="font-medium text-gray-900">Admin</div>
                                <div className="text-xs text-gray-500">Admins can manage users and credentials</div>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              newUser.products.api.role === 'developer' 
                                ? 'border-green-500 bg-white shadow-sm' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            onClick={() => setNewUser({
                              ...newUser,
                              products: {
                                ...newUser.products,
                                api: {
                                  ...newUser.products.api,
                                  role: 'developer'
                                }
                              }
                            })}
                          >
                            <div className="flex items-start space-x-2">
                              <input
                                type="radio"
                                name="apiRole"
                                value="developer"
                                checked={newUser.products.api.role === 'developer'}
                                onChange={() => {}}
                                className="mt-1 text-green-600 focus:ring-green-500"
                              />
                              <div>
                                <div className="font-medium text-gray-900">Developer</div>
                                <div className="text-xs text-gray-500">Developers can manage credentials</div>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              newUser.products.api.role === 'standard' 
                                ? 'border-green-500 bg-white shadow-sm' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            onClick={() => setNewUser({
                              ...newUser,
                              products: {
                                ...newUser.products,
                                api: {
                                  ...newUser.products.api,
                                  role: 'standard'
                                }
                              }
                            })}
                          >
                            <div className="flex items-start space-x-2">
                              <input
                                type="radio"
                                name="apiRole"
                                value="standard"
                                checked={newUser.products.api.role === 'standard'}
                                onChange={() => {}}
                                className="mt-1 text-green-600 focus:ring-green-500"
                              />
                              <div>
                                <div className="font-medium text-gray-900">Standard User</div>
                                <div className="text-xs text-gray-500">Read-only access</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelAddUser}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="bg-black text-white hover:bg-gray-800">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

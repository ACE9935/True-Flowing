import { Client, UserQRCode } from "@/types";
import { Delete, Search } from "@mui/icons-material";
import { Checkbox, TextField } from "@mui/material"; // Import TextField for the search bar
import { useState } from "react";
import { updateUser } from "@/firebase/updateUser";
import { useUser } from "@/context/authContext";
import AppSpinner from "@/components/AppSpinner";
import { ClientInfos } from "@/app/(client-pages)/client/[...provider]/components/ClientForm";

interface ClientsTableProps {
  data: Client[] | {infos:ClientInfos}[]
  type:"winners"|"clients"
  theme:string
  color:string
  lightColor:string
  startIndex: number;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ data, startIndex,color,lightColor,type,theme }) => {

  const itemsPerPage = 20;

  // State to track selected clients
  const [selectedClient, setSelectedClients] = useState<Client[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { user, updateUser: updateCurrentUser } = useUser(); 

  // Function to handle the checkbox change (toggle client selection)
  const handleCheckboxChange = (client: Client) => {
    setSelectedClients((prevSelectedClients) => {
      const isSelected = prevSelectedClients.some(
        (selected) => selected.infos.id === client.infos.id
      );
      if (isSelected) {
        return prevSelectedClients.filter(
          (selected) => selected.infos.id !== client.infos.id
        );
      } else {
        return [...prevSelectedClients, client];
      }
    });
  };

  // Function to handle the deletion of selected clients
  const handleDeleteClients = async () => {
    if (!selectedClient.length) return;

    try {
      if (user) {
        setIsLoading(true);
        
        const updatedClients = data
          .filter((client) => !selectedClient.some((selected) => selected.infos.id === client.infos.id))
          .map((client) => client);

        const updatedEmails = updatedClients.map((client) => ({ content: client.infos.email }));
        const updatedPhoneNumbers = updatedClients.map((client) => ({ content: client.infos.phoneNumber }));

        await updateUser("id", user.id, "clients", updatedClients);
        await updateUser("id", user.id, "clientEmails", updatedEmails);
        await updateUser("id", user.id, "clientPhoneNumbers", updatedPhoneNumbers);
        await updateCurrentUser();

        setSelectedClients([]);
        console.log("Clients deleted successfully!");
      } else {
        console.error("No authenticated user found.");
      }
    } catch (error) {
      console.error("Error deleting clients: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter clients based on the search query (name, email, or phone number)
  const filteredClients = data.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (type=="winners"?client.infos.prize!.toLowerCase().includes(searchLower):false)||
      client.infos.name.toLowerCase().includes(searchLower) ||
      client.infos.email.toLowerCase().includes(searchLower) ||
      client.infos.phoneNumber.toLowerCase().includes(searchLower)||
      user?.qrCodes?.find((qrcode:UserQRCode) => qrcode.id === client.infos.qrcodeId)?.name.toLowerCase().includes(searchLower)
    );
  });

  // Sort the clients by date of submission (newest to oldest)
  const sortedData = filteredClients.sort((a, b) => {
    const dateA = new Date(a.infos.submitDate.split("/").reverse().join("-"));
    const dateB = new Date(b.infos.submitDate.split("/").reverse().join("-"));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div>
      {selectedClient.length ? (
        <div className="p-4 rounded-md bg-blue-100 border-x-2 border-t-2 flex items-center gap-6">
          <h2 className="text-xl">{selectedClient.length} clients selected</h2>
          <div
            className="font-bold flex items-center !text-sm hover:bg-slate-400/40 rounded-md cursor-pointer p-2"
            onClick={handleDeleteClients}
          >
            <Delete /> DELETE
          </div>
          {loading ? <AppSpinner variant="LIGHT" size={40} /> : null}
        </div>
      ) : (
        <div className="p-3 py-1 rounded-md border-x-2 border-t-2 flex items-center justify-between">
          <h2 className="text-2xl">Clients</h2>
          <div className="p-4">
          <Search sx={{position:"absolute"}} className="m-2"/>
        <input
          value={searchQuery}
          className="rounded-full bg-slate-300/70 p-2 pl-9 outline-gray-400 focus:outline-2 focus:outline-primary-blue outline-1 outline"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, phone number, or QRcode name"
        />
      </div>
        </div>
      )}
      <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-x-scroll">
        <thead>
          <tr className={`text-white ${theme}`}>
              {type=="clients"&&<th className="py-2 px-4 border-b border-gray-300 text-left"><Checkbox
                disableRipple
                indeterminate={selectedClient.length > 0 && selectedClient.length < sortedData.length}
                checked={selectedClient.length === sortedData.length && sortedData.length > 0}
                onChange={() => {
                  if (selectedClient.length === sortedData.length) {
                    setSelectedClients([]);
                  } else {
                    setSelectedClients(sortedData);
                  }
                }}
              /></th>}
            <th className="py-2 px-4 border-b border-gray-300 text-left">Order</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Email</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Phone</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Date of submission</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Scanned QRCode</th>
            {type=="winners"&&<><th className="py-2 px-4 border-b border-gray-300 text-left">Code</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Prize</th></>}
          </tr>
        </thead>
        <tbody>
          {!sortedData.length ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No clients found
              </td>
            </tr>
          ) : (
            sortedData.map((client, index) => (
              <tr key={index} className={index % 2 === 0 ? lightColor : color}>
                
                {type=="clients"&&<td className="py-2 px-4 border-b border-gray-300"><Checkbox
                    onChange={() => handleCheckboxChange(client)}
                    checked={selectedClient.some(
                      (selected) => selected.infos.id === client.infos.id
                    )}
                    disableRipple
                  /></td>}
                
                <td className="py-2 px-4 border-b border-gray-300">{startIndex + index + 1}</td>
                <td className="py-2 px-4 border-b border-gray-300">{client.infos.name}</td>
                <td className="py-2 px-4 border-b border-gray-300">{client.infos.email}</td>
                <td className="py-2 px-4 border-b border-gray-300">{client.infos.phoneNumber}</td>
                <td className="py-2 px-4 border-b border-gray-300">{client.infos.submitDate}</td>
                <td className="py-2 px-4 border-b border-gray-300">{user?.qrCodes?.find((qrcode:UserQRCode) => qrcode.id === client.infos.qrcodeId)?.name}</td>
                {type=="winners"&&<><td className="py-2 px-4 border-b border-gray-300 text-left">{client.infos.winningCode}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-left font-bold">{client.infos.prize}</td></>}
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ClientsTable;



